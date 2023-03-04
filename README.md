# [mafiaclub.github.io](https://mafiaclub.github.io)
This is the source code for the above website. It hosts role descriptions for the [Mafia](https://en.wikipedia.org/wiki/Mafia_(party_game)) format played by Cornell Mafia Club.

## Architecture
The website is a static site hosted on [github pages](https://pages.github.com/). The master branch is auto-deployed. The site uses [javascript](/index.js) to render json lists into the tabs viewed on the main page. There are two main manifest files and one important folder:
- [roles.json](/roles.json) lists all of the roles the site knows about
- [tier-manifest.json](/tier-manifest.json) lists the tiers that should be displayed on the main page
- [tiers](/tiers) contains json files for each tier describing the roles in that tier

Stack-wise the site is relatively simple. We use:
- bootstrap for the UI to make the site look ok
- popper.js to render the tooltips that show you what the role does
- jquery to find/replace nodes in the domain
- custom Javascript implementing our domain logic
- Everything is tied together in index.html which is just a skeleton that loads data from the json files

## Handbook
This section describes common tasks that you might want to do.

### Add a new role to a tier
1. Add the role to `roles.json`. For example this could describe a role:
   ```
   {
       "name": "1-Shot Bulletproof Mafia",
       "description": "Protected from one kill during the night.",
       "team": "Mafia"
   }
   ```

   Roles must have a `name`, `description`, and `team`, but can have any other fields (just for metdata purposes) if you want to. I recommend also including `author`.

2. Add the role to the file corresponding to the tier you want to add it to. For example if we wanted to add 1-Shot Bulletproof Mafia to Basic, we'd add:
   ```
   "1-Shot Bulletproof Mafia",
   ```

   to [tiers/basic.json](/tiers/basic.json).

### Create a new tier
1. Create a new file in [tiers](/tiers) following the pattern of an existing tier. Notably:
    1. Update the name
    2. Update the description
    3. Make sure the version is unique, it should be the same as the filename (minus `.json`)
    4. Make a list of the roles you want to include in the tier. Note: these roles must be in `roles.json`.
2. Add the tier to [tier-manifest.json](/tier-manifest.json)

### Get rid of an existing tier
1. Delete the entry corresponding to the tier from [tier-manifest.json](/tier-manifest.json).
    - The items in tier-manifest.json correspond to the filenames in [tiers](/tiers) but the names displayed on the site is the name declared in the file for that tier (under the tiers folder)
    - Generally these should be the same, but sometimes they might not be exactly the same
    - If you need to search through all the files in the tiers folder to find the right tier name to delete from tier-manifest.json
2. Conventionally we move tiers not in use to [retired lists](/retired%20lists), just to keep things a little more organized

## Troubleshooting
### Roles/tiers don't render on the site
- Make sure you comma separate the roles properly
    - there should be exactly one comma between every pair of roles, i.e. `{ ... }, { ... }`
    - there shouldn't be an extra comma at the end of the list, this is a relatively common mistake
- Make sure the json files are otherwise syntactically valid. You can run the files through an online checker like https://jsonchecker.com/ if you don't have tools to do this on your computer.
