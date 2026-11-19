# Update history

Everything that was added to Pâtisserie 2D Simulator, from the newest to the oldest. To understand the rules of the game, see the [wiki](REGLES.md).

## Release 1.3.2 (November 19, 2026)

The game no longer lags with 1000 employees, the console is safer, and there are ways to compare, duplicate and protect your games.

**Game**
- The Golden theme: you get it with 5,000 edible gold leaves, it turns Bob all gold, and together with the Tech theme it opens Golden Tech.
- Employees depend on space: at most one per m² (plus 2), and 1000 at the most. With 1000 employees the game is twenty times faster, and the list only draws 50 per job before "Show the others".
- A company can have up to 50 bakeries.
- In the stats, a new "Compare" view puts 2 or 3 of your bakeries side by side.
- The "Welcome back" window gives everything: the real time away (days, months, years), a tab per bakery and a total, and the charts once you have unlocked them. Amounts paid no longer have a minus sign.
- In the bank, Bob has a "Skip" button when he explains the insurance, and loans of a billion or more read properly (100B).
- Numbers follow the language: in English, Chinese, Japanese and Korean a dot is used, and 10³⁰⁰ no longer shows "∞".

**Games**
- A button to duplicate a game in the menu.
- If a game is already open in another tab, Bob warns you before one overwrites the other.
- A file or code with impossible values (negative money, unreadable level...) is refused on import, and when opening a save you are told what was fixed.
- The "Give your first bakery a name" window is mandatory: Esc and a click outside no longer close it.

**Interface**
- On a phone: buttons are at least 44 px, vibrations (which you can turn off in the settings) go with your taps, and the console is readable.
- Languages sit in a grid of 5 per row, drop-down lists are rounded, the fold arrow changes direction, and the XP text and the money are easier to read.
- Shortcuts: / opens the console (once unlocked), S the achievements, Ctrl + Esc the menu. The logo also works with the keyboard, and Bob gives you a hint at 500 logo clicks.

**Console**
- It is much stricter: extra words, unreadable numbers (1e400, abc), negative values and unknown names are refused with a message, changing nothing. Numbers like 1e3, 1,5 or 10^300 are understood.
- Deleting a bakery asks for two confirmations, /max then /unmax brings back your real game, and /max sets the level to 1000 with no XP.
- Turning the console off asks for confirmation, and once you have unlocked it before, 100 logo clicks are enough to get it back.
- Results use the real names, ingredients are always whole numbers, and gendered messages agree.

## Release 1.3.1 (November 17, 2026)

An insurance, progress bars, proper plurals, and a more comfortable phone.

**Game**
- An insurance in the bank, explained by Bob: three plans (Normal, Expert, Professional), and the higher you go, the more you are covered against disasters, incidents and even repairs.
- Loans go up to 100 billion (100B), and the biggest ones open with your play time.
- Buildings have a bar showing how long is left before their next delivery.
- Achievements have a progress bar: you can see when you will get there.
- The 5 hidden achievements are also unlocked in creative mode and max mode.
- Proper singulars and plurals in the texts: "1 order delivered", "6 orders delivered"...

**Employees**
- The seller, collector, buyer and head waiter have price or amount settings. They are optional: by default they work as before.

**Interface**
- The ingredients list can also be folded and resized on tablets and large screens: a button folds it, a bar changes its size (the width on a computer, the height when it sits on top).
- On a phone, the footer text is no longer half hidden, and notifications show at the very top, without covering the tabs or the sell button.
- A choice event now only shows its banner: the notification no longer hides the "Refuse" button.

**Saves**
- A file that is too big is refused before it is even read.

## Release 1.3 (November 16, 2026)

A smoother game, choices to make, more options for your employees, and an interface made for both phone and computer.

**Game**
- No more freezing when you level up: if you gain several levels at once, the game now throws one party and shows one message.
- Big numbers are written the way your language does it: in French a billion is "Md", in German "Mrd", and in Chinese, Japanese and Korean numbers are counted in groups of 4 digits.
- Choice events: in the event bar you sometimes get one or two buttons to answer (an investor, a TV crew, a supplier, a tip, a contest).
- The 5 hidden achievements also unlock in max mode, creative mode and with the command.
- When you turn the music off, it stops right away instead of at the end of the piece.

**Bank**
- Loans up to 100,000,000: the biggest ones open up little by little with your play time.

**Employees**
- In the employee search, the button is greyed out and says "Pick a job" until you pick one.
- The seller can sell only above or below a set price.
- The head waiter can deliver only the orders that pay (or leave a profit) more or less than an amount.
- The buyer can buy only the ingredients whose price is above or below an amount.

**Bob**
- When Bob has several things to say at once, he sends a single, slightly longer bubble with the whole summary.
- You can click a bubble to close it.
- In Arabic, the "Bob" label is now on the right of the bubble.

**Interface**
- Achievements have their own button, a trophy in the header, and are no longer in the settings.
- On a phone, the ingredients list folds away when you are not on the recipes, and you can fold or unfold it whenever you like. Notifications no longer hide the sell button.
- On a computer, you can resize the ingredients list and the right panel by dragging the bar between them.
- On a computer, R opens the settings, C the changelog and M the bakery picker. A "Controls" page in the settings lists them (it only shows on a computer or with a keyboard).

**Saves**
- Save files are now named "p2ds-company-save-time-date.p2ds", in your language.
- A save can no longer exceed a reasonable size: a file inflated by hand is refused on import.

## Release 1.3 Snapshot 3 (November 16, 2026)

The archives have their own page, in the colors of the game menu.

**Archives**
- The archives page reuses the game menu: the logo, "P2DS", a yellow "ARCHIVES" badge and one tile per old version, with its name and release date, 5 per row. An arrow takes you back to the game.
- In the menu, the changelog has an "Archives" button at the top left. The blue buttons that led to a version are gone: you go through the archives.

## Release 1.3 Snapshot 2 (November 16, 2026)

A cleaner dark theme, and the Alpha versions one click away.

**Game**
- The dark theme is improved: drop-down lists, fields, scrollbars, links and windows finally follow the theme, and nothing stays white or too dark.
- In the changelog, the "update available" box only shows from the menu, and it reads well in the dark theme. So do the "Play this version" links.
- At the very bottom of the changelog, a drop-down lets you play the Alpha versions in your browser.

## Release 1.3 Snapshot 1 (November 16, 2026)

A save that downloads itself, an easier Cookie theme, and old versions you can play again.

**Game**
- **Automatic backup:** in the settings, pick an interval (from 5 minutes to 4 hours): a file of your save is downloaded by itself so you never lose it.
- The Cookie theme unlocks at 50,000 cookies sold (instead of 100,000).
- In the changelog, every version we keep a copy of has a "Play this version" link, and the titles are properly white in the dark theme.

**Website**
- A "About, How to play and Changelog" page, and an "Old versions" page to play or download past versions again.

## Release 1.2.3 (November 15, 2026)

Your company has a name, so does your first bakery, and your game list stays up to date.

**Game**
- When you create a game, Bob asks for the name of your company: it will be the name of your game. Your first bakery has no name yet: Bob asks you to name it, for free.
- The achievements page is handier: search, filters (all, unlocked, to do), "All" to see everything at once, and a progress bar for each category.

**Accounts and app**
- If you delete or rename a game from another device or the browser, the app's list updates by itself, with nothing to do.

## Release 1.2.2 (November 15, 2026)

More detail in the stats, updates without reloading, and a Bob who warns you when the wifi drops.

**Game**
- In the stats, recipes prepared and ingredients prepared each have a drop-down menu: you can see the number of each recipe and each ingredient.
- In French, Spanish, Portuguese, German, Russian or when using euros, decimal numbers are written with a comma (1,50 instead of 1.50).
- Bob gets angry much more slowly: it takes far more clicks to push him over the edge.
- Without wifi, Bob tells you: your game is not saved until the connection is back. Your other games can still be played, but they are not saved either.

**Updates**
- When a new version exists, the version button turns green, in the browser and in the Windows app.
- The "Update" button in what's new updates the game without reloading the page. In the Windows app, it restarts by itself.

**Accounts**
- After a "forgot password" link, you can choose a new password right in the game.

**Shortcut**
- When you install P2DS as an app (shortcut), its logo is smaller and well centered: it no longer touches the bottom of the icon.

## Release 1.2.1.2 (November 15, 2026)

A small detail for app updates.

**Windows app**
- The update window now shows the real name of the version ("Release 1.2.1.2"), and no longer an internal number.

## Release 1.2.1.1 (November 15, 2026)

Small fixes.

**Windows app**
- The "Sign up on the website" button now really opens the website in your browser.

**What's new**
- The what's-new list is now translated into every language. Older versions stay in English outside French and English.

## Release 1.2.1 (November 14, 2026)

Fixes and a simpler sign-up.

**Game**
- Carriers now need at least 2 bakeries: with only one, they quit and you can't hire more.
- The settings close button no longer flickers when the mouse passes between the button and the background: only its icon turns.
- In the manager settings, the "Priority" part is now separated from "Jobs to hire".

**Menu and accounts**
- The "P2DS" title of the menu is white in dark mode.
- The "Continue with Google" button animates when the mouse is over it, like the other buttons.
- Signing up no longer sends a confirmation email: the account is ready right away. In the app, "Sign up" opens the website.
- You can sign in to the Windows app with your account.

**Windows app**
- The installer now only asks for your language. Saves and account are handled in the game, on the home page.

## Release 1.2 (November 14, 2026)

A real home page, several games, accounts, and a Windows app.

**Home page**
- The game now starts on a clean home page: the logo and "P2DS" at the top, your games below, and the same small footer as in the game.
- The version number, with what's new, is at the top left. At the top right: the account, the settings (language and light or dark theme) and the app download.
- Each slot shows the name, level and date of your game, all centered. Clicking the slot opens the game; two small buttons export or delete (trash).
- You can have up to 10 bakeries, in two rows of 5.
- A single + button opens a window: new game (a big animated Create button, no name to give: Bob asks for it), paste a save code, or open a save file. When you have 10 games, the + disappears and the game tells you the maximum is reached.
- The menu never changes its look depending on your game theme: it is light, dark or automatic (your browser's), chosen in its settings.
- Each game keeps its own language, which can differ from the menu's. A new game starts in the menu's language.
- Your previous game automatically becomes your first slot: nothing is lost.
- In the game, an arrow at the top takes you straight back to the menu, with no window.

**Online accounts**
- You can create an account (username, email, password) or continue with Google, but it's not required. Your games sync with your account as soon as you have internet, and you can play offline with the local saves.
- No account: your game stays in the app or in the browser. If you uninstall one or switch browsers, you lose it, unless you export it.

**Windows app**
- A button, to the left of the bakeries one, installs the Windows app in one click. It only shows in a browser, on a Windows PC.
- The app works completely offline, updates itself when you have internet, and never touches your saves.
- The installer asks you three questions: your language, your saves and your account.

**Game**
- Tab badges are yellow, except the breakdown ones, which stay red.
- A broken building now shows a red badge on the Buildings tab, like machines.
- The manager can automatically refuse applications whose level is too low.
- The Cookie theme unlocks at 100,000 cookies sold instead of one million.
- What's new opens much faster: it is kept from one time to the next and the oldest versions only show on request.
- On phones, changing theme no longer shifts the bottom bar.
- The "Save" part left the game settings: you export and delete your games from the home page.
- In the settings, languages always keep the same order (English, French, Spanish…).
- In the manager, the gold level only appears in the choices once unlocked (level 120).

**Small changes**
- The game shows "Release 1.2" as its version number.

## Release 1.1.2 (November 14, 2026)

The game updates without making you leave your game, and tabs can be arranged as you like.

**Updates**
- The game checks from time to time, with no lag, whether a new version exists. If so, Bob tells you, and the version number turns green.
- In what's new, a button updates the game without reloading the page. Your game is saved right before.
- Offline, the game is no longer saved. The game tells you, and resumes as soon as the connection is back.

**Tabs**
- At level 450, you can drag the tabs left or right to arrange them as you like.
- The Machines tab shows a red badge with the number of broken machines.

**Employees**
- You need at least two bakeries to have carriers.

**Phone**
- When there are several time gauges in the bottom bar, you can scroll them left and right to see them all.
- The bottom bar no longer hides the end of the tabs: you can reach the very end of the list.

## Release 1.1.1 (November 14, 2026)

A smoother game, richer employees, and the ability to play without a connection.

**Smoothness**
- The game lags much less: the head chef, prices and recipe lists are computed much faster, and nothing is redrawn when the tab is hidden or a window is open.

**Playing offline**
- Once the game is loaded, you can play without internet. Your game stays saved in your browser. To get an update, you must be connected and reload the page.

**Employees**
- Even more detailed faces, with more hairstyles and details. No more mustache for women.
- The countdowns in an employee's card (training, job change, next transfer) now tick down by themselves.
- Carriers choose their rhythm: continuous, just once, or every 1, 2, 5, 10, 30 or 60 minutes. A button starts a transfer right away or starts the regular transfers.

**Small changes**
- The button to go back to the top of the ingredients appears once you pass two thirds of the list, without flickering.
- The game now shows "Release 1.1.1" as its version number.

## Release 1.1.0 (November 13, 2026)

Much deeper employees, a preparation system that finally handles space, and plenty of extra settings.

**Preparing and selling**
- You can prepare even when very little space is left: the bar freezes until you free some.
- Space fills little by little, as the preparation bar advances.
- Click a preparation bar to throw it away: you get back part of the ingredients, less and less as the bar has advanced.
- Identical preparations group together in the bottom bar, with a small "x2", "x3"…
- The money from a sale arrives little by little, as the bar advances.
- When you can't prepare, the recipe card shows everything that is missing at once: ingredients and space.
- The bottom bar is finally visible on phones.
- Ingredients and recipes being unlocked have their progress bar at the bottom.

**Employees**
- 10 levels instead of 5. The higher you go, the less rare high levels are. Right after unlocking employees, only levels 1 and 2 exist.
- Apprentices no longer have a level.
- Before level 10, nobody shows up on their own: you have to start a search.
- You can search for two jobs at once.
- A new type of employee, the jack of all trades: up to 3 jobs (level 3 at most), a level of their own, and a job they focus on. Changing job takes 10 seconds to 1 minute.
- The manager chooses which jobs they hire, which come first, and at which levels.
- The head chef has an hourly budget, and prepares nothing below an amount you choose.
- You can change an employee's salary from −50% to +50%. Paid less, their top morale is lower. Paid too little, they almost always quit.
- Women have their job title in the feminine form: cueilleuse, boulangère, pâtissière…
- More realistic faces, with more details.

**Collectors**
- Two levels: efficiency, and loss (from 0% to 100% of what they pick). Applicants usually lose 1 to 20%. The less they lose, the more they cost.
- Limits: only pick if there is less than N, or produce N per hour.
- When you change a collector's ingredient, their countdown shows in their card and in the bottom bar.
- Very rare high-level collectors can be specialized in one ingredient: very fast training, but no more changing.

**Bob**
- Bob has new outfits and a new face in each theme.

**Settings**
- An auto-pause: if you don't touch anything for the chosen time, the game pauses.
- Saving can be done by file or by copy and paste, your choice.
- Nice animations when opening and closing the settings.

**Small changes**
- A button to go back to the top of the ingredient list.
- Sugar has a new icon: a sugar cube.
- 5 new music tracks, to unlock as you level up.
- The game only shows "1.1" as its version number.

## Release 1.0 (November 9, 2026)

The first complete version of the game.

**Languages**
- Russian, complete: the game now exists in 10 languages.

**Themes**
- New Cookie theme, with cookies, chocolate chips, a glass of milk and a cookie jar, unlocked after 1 million cookies sold.
- Hidden themes to discover.
- The Party and Space themes stay hidden until you reach their level.

**Bob**
- Sugar can be given to Bob as soon as he isn't well: sad, angry or sick. Not when he's happy.
- The tutorial changes with his mood. If he's too angry, he waits until he calms down to explain it.
- Bob has new expressions, and sometimes much stronger reactions. See which ones for yourself.

**Employees**
- Faces of men and women, matching their first name.
- A collector who changes ingredient takes time to get going: from 10 s at level 1 to 2 min at max level.
- Rare applications from already trained employees, who cost more. You can click an application to see its job and level.

**Small changes**
- The version number returns to its former look, while staying clickable to see what's new.

## Beta 1.9 (November 8, 2026)

**Removed**
- Rebirths no longer exist: no more banner, no more rebirth bonus. The 7 rebirth achievements are replaced by 7 machine level achievements.

**What's new**
- The head chef can prepare only what is missing for the current orders.
- Click the version number at the top to see these news in the game.
- Bob knows 30 anecdotes about pastries instead of 15.
- Bob reacts to other ingredients you give him. Find out which ones.
- Near the start, Bob offers to send you notifications when you're not on the game: if your bakery runs without a pause, or if something important happens.

**Phone**
- Event announcements are smaller and hide less of the screen.
- Preparation and sale time is visible again, next to each bar.

**Small changes**
- In the employee dashboard, "working", "on break" and "on strike" are written in their color, which changes with the theme.

## Beta 1.8.1 (November 8, 2026)

- Two new complete languages: Japanese and Korean. The game now exists in 9 languages.
- Orders speed up little by little with your level: one every 10 seconds only at level 1000.

## Beta 1.8 (November 8, 2026)

**What's new**
- Horror theme, only in October: black and orange, pumpkins, bats, ghosts, cobwebs and graves. Bob puts on his witch hat.
- At least 100 machines: 80 more, in 16 families of 5 models, with new bonuses (morale, salaries, unlocks, breakdowns).
- Machines sometimes break down (quick, cheap repair), and very rarely a building (long, expensive repair).
- Big misfortunes, very rare, from level 30: flood, burglary, freezer failure, small fire.
- The further you go, the more orders customers place.
- A recipe you haven't prepared for a long time sells for more.
- Bob gives advice, reminds you to save and tells anecdotes about pastries. It can be turned off in the settings.

**Settings**
- The save is downloaded to a file and opened from a file, instead of a code to copy and paste.
- English is first in the languages, then French.
- The Save tab goes to the very bottom, under achievements and statistics.

**Employees**
- The dashboard goes to the very top of the tab, with the employee search inside it.

**Balance**
- The pure infinity source unlocks at level 1000: nothing unlocks after it.

## Beta 1.7 (November 8, 2026)

**Employees**
- A dashboard at the top of the tab, from level 20: the number of employees per job, those working, on break or on strike, deliveries on the road, and what each collector picks. Bob explains it.
- Employees are sorted by job: the best at the top, apprentices at the bottom. You can drag a job, or use its arrows, to change the order.
- More realistic faces: shoulders in the job's color, ears, eyebrows, real eyes, nose, several hairstyles and sometimes a beard.

**Transport**
- A carrier's trip now lasts between 10 s and 10 min. It can be late, or have an accident and lose its load.

**Economy**
- Preparing the same recipe too often lowers its selling price.
- New events that only affect one ingredient (shortage, record harvest) or one recipe (trendy, snubbed).

**Icons**
- New icons for crêpes, madeleines, tiramisu and almonds. Hazelnuts change too, so they don't share the almonds' icon.

## Beta 1.6.1 (November 8, 2026)

- Two new languages: Arabic, with the whole game reading right to left, and Mandarin (simplified Chinese).
- The hidden theme is removed.
- Sugar for Bob: no more button or hint, it's up to you to understand what pleases him.
- Recipe icons are back as they were before Beta 1.6.
- Fixed: a button or card that flickered when the mouse was right at the edge.
- Fixed: with many languages, their buttons overflowed in the settings.

## Beta 1.6 (November 7, 2026)

- The hidden theme turns green and brown: pixel blocks of grass, dirt, wood and stone, trees, torches and a little block pastry chef. Bob changes outfit with it.
- On phones, you give sugar to Bob by dragging it from the sugar card, like with the mouse. The button next to Bob disappears.
- 8 new icons: no recipe shares its icon with another any more (crêpes, madeleines, fraisier, tiramisu, imperial tiramisu, fondant, saint-honoré and cardamom cake).
- Eggs cost a tiny bit less: €0.28 instead of €0.30.
- An employee can be put on break from their card. They stop working, but are still paid.

## Beta 1.5 (November 7, 2026)

**Languages**
- The game now exists in Portuguese and German, in addition to French, English and Spanish. Everything is translated, down to Bob's lines and the 1000 achievements.
- The game picks these languages by itself if your browser uses them.

**Themes**
- New Bakery theme at level 100: striped awning, baguettes, croissants, pretzels, wheat ears and flour sacks. Bob dresses as a baker.
- A new hidden theme, to discover.

**On GitHub**
- This update history.

## Beta 1.4 (November 7, 2026)

**Employees**
- Five levels per employee, with training to reach the next one.
- Each employee has a face and their own settings.
- You now start a search to hire, and it doesn't always succeed.
- New: the apprentice, for whom you pay a job, the head chef, who prepares on their own, and the purveyor, who orders missing ingredients.

**Economy**
- Machines are specific to each bakery, and there are more of them.
- Buildings deliver a huge quantity once an hour instead of producing every second.
- Ingredients and recipes unlock with a click, after a short wait.
- Sales take a short delay.

**Bob**
- He talks more and explains each new feature when it arrives.
- He refuses to help you if you annoyed him.

**Phone and tablet**
- No more accidental zoom or reload.
- Bob's bubble and the bottom bar are reworked.

## Beta 1.3 (November 7, 2026)

- New employee: the carrier, who takes money or stock to another of your bakeries.
- Bob gives his advice in his bubble, and no longer has his own interface.
- Complete Spanish.
- 1000 achievements, sorted in the settings with the statistics.
- The bank becomes the last tab.
- Buildings arrive at level 40 and the Party theme at level 500.
- The Escape key pauses the game.
- On small screens, ingredients go above the tabs.
- Seasonal cakes are removed.

## Beta 1.2 (November 7, 2026)

**Bakeries**
- All your bakeries work at the same time.
- Each bakery can have its own theme.

**What's new**
- Customer orders and a head waiter to deliver them.
- Machine shop.
- 40 seasonal cakes (removed in Beta 1.3).
- Space and Party themes, and a new logo.

**Bob**
- He changes face and outfit, likes sugar and sets you challenges.

**Balance**
- Debt comes less easily.
- The loan limit depends on your level.
- Repaying a loan early costs less.

## Beta 1.1 (November 6, 2026)

- Bank and loans, explained by Bob.
- Illustrated seasonal themes: flowers, beach, leaves and snow.
- New settings and pause menu.
- Charts and totals from the second bakery.
- Renaming your bakery costs €100.

## Beta 1.0 (November 6, 2026)

- Introduction with Bob.
- Music composed for the game.
- 708 achievements.
- Rebalanced economy and fixes.

## First release (November 5, 2026)

- The game is online, with a new interface: new font, glassy header, animated background and fixed bottom bar.
- New icons in place of system emojis.
- Animations: particles, bounces and smooth bars.
