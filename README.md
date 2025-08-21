
<p  align="center">
<img  src="https://raw.githubusercontent.com/przemek54/an-easy-world/main/assets/logo.png"  alt="Logo"  width="300"  style="margin-bottom: 0;"></p>
<p  align="center">by <b>54</b></p>

  

**[An Easy World](https://www.geoguessr.com/maps/66ca6b77095a4f41baf80ece)** is a Geoguessr map intended to help players learn faster. Despite the name, it's not *too* easy, depending on where you set your standards. Don’t anticipate free 5ks being handed out left and right – instead, expect to see a clue in each location and aim to get the country right every time. And the region, whenever you can.

## Skill level
The goal of the map is to be:
- **approachable for beginners**, who may use it to differentiate between countries;
- **challenging for intermediate players**, who will usually know the country, but are encouraged to region-guess within it;
- **relaxing for advanced players**, who may use it for laid-back gameplay or solidifying their knowledge.

## Map
An Easy World (AEW) serves as an unofficial extension of the **[PlonkIt guide](https://www.plonkit.net/)**, with every meta on the website being represented in the map by at least 5 locations. It is intended for **NMPZ**, but you can play it any way you like. Some locations might be too easy if you allow yourself to turn around.

![Gameplay image](https://raw.githubusercontent.com/przemek54/an-easy-world/main/assets/gameplay-image.png)

As of version 0.3.1, the map contains 2,325 locations across 1 continent. For more detailed statistics and current progress, visit the **[AEW Hub](https://przemek54.github.io/AEW/)**.

**[Play the map here!](https://www.geoguessr.com/maps/66ca6b77095a4f41baf80ece)**

## Script
AEW features a script that provides **real-time hints** for each location and it accounts for all clues visible to you. They are sorted by continent, country and region, so that you can view them at your own pace for narrowing down your guesses.

![Script functionality](https://raw.githubusercontent.com/przemek54/an-easy-world/main/assets/gif-1.gif)

The core functionality of the script is **Reveal Mode**, which allows you to show or hide place names and images for a more fun learning experience. It encourages you to think closely about the round before you're given the final answer.

![Reveal Mode](https://raw.githubusercontent.com/przemek54/an-easy-world/main/assets/gif-2.gif)

The script only works on AEW and **should only be used in NMPZ**. Moving breaks it completely because it can't fetch the correct location, and panning results in an incomplete experience because not all clues available to you are displayed as hints.

## Installation guide
1. Install the **TamperMonkey** extension for your browser. It's a tool that allows users to add Userscripts to websites (such as this one). You can find links for each browser **[here](https://www.tampermonkey.net/index.php?browser=chrome&locale=en)**.
2. If you use Google Chrome, you will need to enable **developer mode**. To do that, go to Settings > Extensions, and in the top-right corner you should have a toggle switch for developer mode. If you use a different browser, you should be good to go.

![Developer mode on Google Chrome](https://raw.githubusercontent.com/przemek54/an-easy-world/main/assets/devmode.png)

3. **[Click this link.](https://przemek54.github.io/an-easy-world/src/AnEasyWorld.user.js)** It should open a TamperMonkey window prompting you to install the script. Click "**Install**". You can also reinstall it the same way in case you mess around with the script and break it. The script should update automatically, but if you ever want to do it manually, click that link as well.

![Click "Install" when prompted](https://raw.githubusercontent.com/przemek54/an-easy-world/main/assets/install.png)

4. Test it out! Start a game on **[An Easy World](https://www.geoguessr.com/maps/66ca6b77095a4f41baf80ece)** and you should get a pop-up with hints in the top-left corner. You may have to refresh the website on the first run.

## Troubleshooting

If step 3 didn't work (you didn't get a pop-up asking you to install), it might mean TamperMonkey isn't set up properly. Make sure you have it in your list of extensions. If you use Google Chrome, **make sure developer mode is turned on** (step 2). Try to look for the answer online, or on **[TamperMonkey's FAQ page](https://www.tampermonkey.net/faq.php)**.

If TamperMonkey otherwise works normally, you can also install the script manually:
1. Go to **Extensions** > **TamperMonkey** > **Add a new script**. It will open up the editor for you to create a new Userscript. Clear whatever is there, make sure it's empty.
2. Download the latest release of the **AEW script** (whatever is at the top **[here](https://github.com/przemek54/an-easy-world/releases)**)
3. Unzip the file, open AnEasyWorld.user.js in Notepad, and **copy** the entire content of the file.
4. **Paste** it into the Userscript editor on TamperMonkey and save (Ctrl+S).
5. Test it out on the **[AEW map](https://www.geoguessr.com/maps/66ca6b77095a4f41baf80ece)**, refresh if it still doesn't work.
6. If the issue persists, feel free to reach out to me here through GitHub issues, on Discord (**przemek54**), or even in GeoGuessr (**[54](https://www.geoguessr.com/user/57f8b66418cee073b8279fdc)**).

## Further documentation
This note is meant to serve as a quick introduction. For more information regarding the project, using the script, detailed map statistics, changelog, FAQ and more, visit the **AEW Hub** – **[www.aneasyworld.eu](https://www.aneasyworld.eu/)**.

Information related to the script itself (public API, script changelog) can be found in this GitHub repository. I encourage any feedback through issues or pull requests.

## Credits
This project includes code from **[Logan Card (0x978)](https://www.0x978.com/)**, used with his permission. His original work can be found **[here](https://github.com/0x978/GeoGuessr_Resolver)**.

## Other resources
There are a few projects with a similar premise that I highly recommend you try out:
* **[LearnableMeta](https://learnablemeta.com/)** by **trausi** – if you like AEW, you'll *love* LearnableMeta. It's a massive project that also features a script with hints (by **plurk**), a variety of maps for different regions and countries, as well as a tool for creating maps designed for their script with a community of creators. There are countless maps like AEW over there, so get lost in exploration!

* Official **[PlonkIt](https://www.plonkit.net/guide)** maps by **the PlonkIt team** – most guides contain a section with learning resources in the bottom, which contain clues described in the document. You might want to try these for more condensed practice, especially fresh after reading a guide. They also include maps made by other authors, so it can be a great place to learn straight from the experts.

* **[Regionguessing Meta Library](https://docs.google.com/spreadsheets/d/1UNvkoY-LaktF75nU_cP7-wVRAEvH3fSqVZet20HqxXA/edit?gid=1650999349#gid=1650999349)** by **Lupus** – AEW contains only clues present on PlonkIt. If your heart yearns for more metas, this collection might be right up your alley. It contains anything from maps, to infographics shared on Discord, to hundreds-of-pages-long documents about specific countries.
