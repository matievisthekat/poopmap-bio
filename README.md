# PoopMap Bio
Include your poops from [PoopMap](https://www.poopmap.net) ([Android](https://play.google.com/store/apps/details?id=net.poopmap) / [iOS](https://itunes.apple.com/us/app/poop-map/id1303269455?mt=8)) in your GitHub bio, like this:

<p align="center">
   <img src="https://i.imgur.com/hVwDcZO.png?1" />
</p>

### Important Note
The action automatically keeps your original bio. It will add the poop section in this format: `{your_bio} {seperator} {x} poops in the last day` so try not to include the seperator symbol (default: ` | `) in your bio

### Example
```yml
name: PoopMap
on:
  # Schedule updates (each hour)
  schedule: 
    - cron: "0 * * * *"
  push: 
    branches: 
      - master
      - main
jobs:
  poopmap-bio:
    runs-on: ubuntu-latest
    steps:
      - uses: matievisthekat/poopmap-bio@latest
        with:
          # Your GitHub token (MUST INCLUDE 'user' SCOPE)
          personal_access_token: ${{ secrets.POOP_TOKEN }}
          
          # Your PoopMap username
          username: "poop-face-bob"
          
          # Your PoopMap password
          password: ${{ secrets.POOP_PASSWORD }}
          
          # Your preferred seperator, default: |
          seperator: "|"
```

### Notes
This action currently only calculates poops from the last 24 hours. If you would like other time frames please open an issue or fork this repo and create a PR
