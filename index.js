const fs = require('fs-extra');
const path = require('path');
const read = require('fs-readdir-recursive');
const mkdirp = require('mkdirp');
const Handlebars = require('handlebars');
const rimraf = require('rimraf');

const GENERATED_DOCKERFILES_PATH = path.join(__dirname, 'generated-dockerfiles');

const dockerTemplates = read('.').filter(function (filePath) {
  return filePath.includes('Dockerfile.hbs');
});

const circleDependencies = [];
const circleDeployments = [];

// cleanup
rimraf.sync(GENERATED_DOCKERFILES_PATH);
rimraf.sync('./.circleci');

// regenerate
dockerTemplates.forEach((templatePath) => {
  const dir = path.resolve(templatePath, '../');
  const linuxDistributionName = dir.split('/').pop();
  const versions = require(`${dir}/versions`);
  const source = fs.readFileSync(`${dir}/Dockerfile.hbs`, 'utf-8');
  const template = Handlebars.compile(source);

  versions.forEach((version) => {
    const tag = `${version.nodeVersion}-${linuxDistributionName}`;
    const dockerFileLocation = path.join(GENERATED_DOCKERFILES_PATH, linuxDistributionName, tag);
    const dockerFileContent = template({
      nodeVersion: version.nodeVersion
    });

    circleDependencies.push(`version=$(node -pe "($(cat package.json)).version"); cd generated-dockerfiles/${linuxDistributionName}/${tag} && docker build -t godaddy/node:${tag}-$version .;`);
    circleDeployments.push(`version=$(node -pe "($(cat package.json)).version"); cd generated-dockerfiles/${linuxDistributionName}/${tag} && docker push godaddy/node:${tag}-$version;`);

    mkdirp.sync(dockerFileLocation);

    version.additionalFiles.forEach(file => {
      fs.copySync(path.join(dir, file), path.join(dockerFileLocation, file));
    });
    fs.writeFileSync(path.join(dockerFileLocation, 'Dockerfile'), dockerFileContent);
  });
});

const source = fs.readFileSync('./circle.hbs', 'utf-8');
const circleTemplate = Handlebars.compile(source);

const circleYml = circleTemplate({
  deployments: circleDeployments,
  dependencies: circleDependencies
});

mkdirp.sync('./.circleci');
fs.writeFileSync('./.circleci/config.yml', circleYml);
