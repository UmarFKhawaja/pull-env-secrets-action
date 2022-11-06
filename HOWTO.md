# Publish a new version

```shell
npm install --location=global @vercel/ncc
npm install
npm run build
git add .
git commit -m "Bump version number to v?.?.?."
git tag -a -m "Release version number v?.?.?."
git push --follow-tags 
```