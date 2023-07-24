# Shush

### Compile
```bash
npm i -g @vercel/ncc
```

```bash
ncc build index.js -o dist
```

### GitHub Actions Example

`shush.yml`
```yaml
name: Deploy app on push or pull request

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  shush:
    name: SSH Deploy
    runs-on: ubuntu-latest
    steps:
      - name: ssh deploy
        uses: littleomie/shush@main
        with:
          host: ${{ secrets.REMOTE_HOST }}
          port: ${{ secrets.REMOTE_PORT }}
          user: ${{ secrets.REMOTE_USER }}
          # password: ${{ secrets.REMOTE_PASSWORD }}
          key: ${{ secrets.REMOTE_KEY }}
          passphrase: ${{ secrets.REMOTE_PASSPHRASE }}
          commands: |
            echo "Deploying to remote server..."
            cd ~ && sh test.sh
```