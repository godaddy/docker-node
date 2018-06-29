# Publishing to Docker Hub

1. Make sure to be on `master` with the latest changes

```bash
git checkout master
git pull
```

2. Create a release using `npm` and take [SemVer](http://semver.org/) into consideration

```bash
# releasing a fix
npm version patch -m 'chore(package): bump version to %s'

# releasing a feature
npm version minor -m 'chore(package): bump version to %s'

# releasing a breaking change
npm version major -m 'chore(package): bump version to %s'
```

3. Push to GitHub

```bash
git push && git push --tags
```

4. Let Circle CI do the rest
