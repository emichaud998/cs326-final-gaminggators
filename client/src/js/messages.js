'use strict';
import { postData, getData } from './utils.js';

class MessagesList {
    constructor() {
        this.messageList = [
            {
              "userid": 2,
              "messageid": 0,
              "title": "username2 Sent You Their Wishlist",
              "message": "[{\"userid\":2,\"gameid\":1020,\"id\":1020,\"name\":\"Grand Theft Auto V\",\"description\":\"The biggest, most dynamic and most diverse open world ever created, Grand Theft Auto V blends storytelling and gameplay in new ways as players repeatedly jump in and out of the lives of the game’s three lead characters, playing all sides of the game’s interwoven story.\",\"cover\":\"game_images/game1020.jpg\",\"release_date\":\"2013-09-17T04:00:00.000Z\",\"follows\":1698,\"rating_count\":2818,\"rating_average\":\"93.423\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/o7q3ikzmkjxbftrd64ok.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/vfdeo6kgu0o4cyzd0sng.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/eepecmqsq6uqxiaukar1.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/hjnzngnrtwr82jzmmkef.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/glvmulyejlde31q8b70z.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/n3t2agwuxlqggp3kryf9.jpg\\\"]\",\"genre\":\"[\\\"Shooter\\\",\\\"Racing\\\",\\\"Sport\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 3\\\",\\\"Xbox 360\\\",\\\"PlayStation 4\\\",\\\"Xbox One\\\"]\",\"publisher\":\"[\\\"Rockstar Games\\\",\\\"Take-Two Interactive\\\"]\",\"developer\":\"[\\\"Rockstar North\\\"]\",\"franchise\":null,\"series\":\"\\\"GTA\\\"\",\"game_modes\":\"[\\\"Single player\\\",\\\"Multiplayer\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Comedy\\\",\\\"Sandbox\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"Mafia II\\\",\\\"L.A. Noire\\\",\\\"Grand Theft Auto: Vice City\\\",\\\"Max Payne 3\\\",\\\"Watch_Dogs\\\",\\\"Spec Ops: The Line\\\",\\\"Murdered: Soul Suspect\\\",\\\"Grand Theft Auto: Vice City Stories\\\",\\\"Watch Dogs 2\\\"]\",\"player_perspectives\":\"[\\\"First person\\\",\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"グランド・セフト・オートV\\\",\\\"그랜드 테프트 오토 V\\\",\\\"俠盜獵車手 5\\\",\\\"GTA5\\\",\\\"GTAV\\\",\\\"Grand Theft Auto Online\\\",\\\"GTA 5\\\",\\\"GTA V\\\",\\\"Grand Theft Auto 5\\\"]\"},{\"userid\":2,\"gameid\":1942,\"id\":1942,\"name\":\"The Witcher 3: Wild Hunt\",\"description\":\"RPG and sequel to The Witcher 2 (2011), The Witcher 3 follows witcher Geralt of Rivia as he seeks out his former lover and his young subject while intermingling with the political workings of the wartorn Northern Kingdoms. Geralt has to fight monsters and deal with people of all sorts in order to solve complex problems and settle contentious disputes, each ranging from the personal to the world-changing.\",\"cover\":\"game_images/game1942.jpg\",\"release_date\":\"2015-05-19T04:00:00.000Z\",\"follows\":1464,\"rating_count\":2494,\"rating_average\":\"93.714\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/mnljdjtrh44x4snmierh.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/em1y2ugcwy2myuhvb9db.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/usxccsncekxg0wd1v6ee.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/z5t0yuhyiiui1ickwhgj.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/farvemmmxav0bgt6wx7t.jpg\\\"]\",\"genre\":\"[\\\"Role-playing (RPG)\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 4\\\",\\\"Xbox One\\\"]\",\"publisher\":\"[\\\"WB Games\\\",\\\"Bandai Namco Entertainment\\\",\\\"cdp.pl\\\",\\\"1C Company\\\",\\\"Spike ChunSoft\\\"]\",\"developer\":\"[\\\"CD Projekt RED\\\"]\",\"franchise\":\"[\\\"The Witcher\\\"]\",\"series\":\"\\\"The Witcher\\\"\",\"game_modes\":\"[\\\"Single player\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Fantasy\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"Minecraft\\\",\\\"The Elder Scrolls V: Skyrim\\\",\\\"Dishonored\\\",\\\"Brothers: A Tale of Two Sons\\\",\\\"Pillars of Eternity\\\",\\\"Dragon Age: Inquisition\\\",\\\"Middle-earth: Shadow of Mordor\\\",\\\"Aarklash: Legacy\\\",\\\"The Cat Lady\\\"]\",\"player_perspectives\":\"[\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"Ведьмак 3: Дикая охота\\\",\\\"Wiedźmin 3: Dziki Gon\\\",\\\"The Witcher 3: Wilde Jagd\\\",\\\"더 위쳐 3: 와일드 헌트\\\",\\\"巫师3：狂猎\\\",\\\"Zaklínač 3: Divoký Hon\\\",\\\"The Witcher III: Wild Hunt\\\",\\\"ウィッチャー3 ワイルドハント\\\"]\"},{\"userid\":2,\"gameid\":472,\"id\":472,\"name\":\"The Elder Scrolls V: Skyrim\",\"description\":\"The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.  \\n \\nPlay any type of character you can imagine, and do whatever you want; the legendary freedom of choice, storytelling, and adventure of The Elder Scrolls is realized like never before.  \\n \\nSkyrim’s new game engine brings to life a complete virtual world with rolling clouds, rugged mountains, bustling cities, lush fields, and ancient dungeons.  \\n \\nChoose from hundreds of weapons, spells, and abilities. The new character system allows you to play any way you want and define yourself through your actions.  \\n \\nBattle ancient dragons like you’ve never seen. As Dragonborn, learn their secrets and harness their power for yourself.\",\"cover\":\"game_images/game472.jpg\",\"release_date\":\"2011-11-11T05:00:00.000Z\",\"follows\":1024,\"rating_count\":2196,\"rating_average\":\"91.913\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/muv70yw3rds1cw8ymr5v.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/xzk2h41fiye7uwbhc6ub.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/urqw7ltwmhr39gkidsih.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/t0mus35qrgclafo1ql8k.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/x5bbaqvgbpaz4hzlfeqb.jpg\\\"]\",\"genre\":\"[\\\"Role-playing (RPG)\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 3\\\",\\\"Xbox 360\\\"]\",\"publisher\":\"[\\\"Bethesda Softworks\\\"]\",\"developer\":\"[\\\"Bethesda Game Studios\\\"]\",\"franchise\":null,\"series\":\"\\\"The Elder Scrolls\\\"\",\"game_modes\":\"[\\\"Single player\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Fantasy\\\",\\\"Sandbox\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"The Elder Scrolls III: Morrowind\\\",\\\"The Elder Scrolls IV: Oblivion\\\",\\\"Minecraft\\\",\\\"Dishonored\\\",\\\"Bioshock Infinite\\\",\\\"Planescape: Torment\\\",\\\"The Elder Scrolls Online\\\",\\\"The Witcher 3: Wild Hunt\\\",\\\"Middle-earth: Shadow of Mordor\\\"]\",\"player_perspectives\":\"[\\\"First person\\\",\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"TESV\\\",\\\"Skyrim\\\",\\\"TESV: Skyrim\\\",\\\"The Elder Scrolls 5: Skyrim\\\",\\\"TESV Skyrim\\\",\\\"TES5 Skyrim\\\",\\\"TES5: Skyrim\\\",\\\"TES5\\\",\\\"TES 5\\\",\\\"TES Skyrim\\\",\\\"The Elder Scrolls V: Skyrim Special Edition\\\",\\\"Dawnguard\\\",\\\"TES5\\\",\\\"The Elder Scrolls 5: Skyrim\\\",\\\"Skyrim\\\",\\\"TESV: Skyrim\\\"]\"}]"
            },
            {
              "userid": 2,
              "messageid": 1,
              "title": "username2 Sent You Their Wishlist",
              "message": "[{\"userid\":2,\"gameid\":1020,\"id\":1020,\"name\":\"Grand Theft Auto V\",\"description\":\"The biggest, most dynamic and most diverse open world ever created, Grand Theft Auto V blends storytelling and gameplay in new ways as players repeatedly jump in and out of the lives of the game’s three lead characters, playing all sides of the game’s interwoven story.\",\"cover\":\"game_images/game1020.jpg\",\"release_date\":\"2013-09-17T04:00:00.000Z\",\"follows\":1698,\"rating_count\":2818,\"rating_average\":\"93.423\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/o7q3ikzmkjxbftrd64ok.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/vfdeo6kgu0o4cyzd0sng.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/eepecmqsq6uqxiaukar1.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/hjnzngnrtwr82jzmmkef.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/glvmulyejlde31q8b70z.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/n3t2agwuxlqggp3kryf9.jpg\\\"]\",\"genre\":\"[\\\"Shooter\\\",\\\"Racing\\\",\\\"Sport\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 3\\\",\\\"Xbox 360\\\",\\\"PlayStation 4\\\",\\\"Xbox One\\\"]\",\"publisher\":\"[\\\"Rockstar Games\\\",\\\"Take-Two Interactive\\\"]\",\"developer\":\"[\\\"Rockstar North\\\"]\",\"franchise\":null,\"series\":\"\\\"GTA\\\"\",\"game_modes\":\"[\\\"Single player\\\",\\\"Multiplayer\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Comedy\\\",\\\"Sandbox\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"Mafia II\\\",\\\"L.A. Noire\\\",\\\"Grand Theft Auto: Vice City\\\",\\\"Max Payne 3\\\",\\\"Watch_Dogs\\\",\\\"Spec Ops: The Line\\\",\\\"Murdered: Soul Suspect\\\",\\\"Grand Theft Auto: Vice City Stories\\\",\\\"Watch Dogs 2\\\"]\",\"player_perspectives\":\"[\\\"First person\\\",\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"グランド・セフト・オートV\\\",\\\"그랜드 테프트 오토 V\\\",\\\"俠盜獵車手 5\\\",\\\"GTA5\\\",\\\"GTAV\\\",\\\"Grand Theft Auto Online\\\",\\\"GTA 5\\\",\\\"GTA V\\\",\\\"Grand Theft Auto 5\\\"]\"},{\"userid\":2,\"gameid\":1942,\"id\":1942,\"name\":\"The Witcher 3: Wild Hunt\",\"description\":\"RPG and sequel to The Witcher 2 (2011), The Witcher 3 follows witcher Geralt of Rivia as he seeks out his former lover and his young subject while intermingling with the political workings of the wartorn Northern Kingdoms. Geralt has to fight monsters and deal with people of all sorts in order to solve complex problems and settle contentious disputes, each ranging from the personal to the world-changing.\",\"cover\":\"game_images/game1942.jpg\",\"release_date\":\"2015-05-19T04:00:00.000Z\",\"follows\":1464,\"rating_count\":2494,\"rating_average\":\"93.714\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/mnljdjtrh44x4snmierh.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/em1y2ugcwy2myuhvb9db.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/usxccsncekxg0wd1v6ee.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/z5t0yuhyiiui1ickwhgj.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/farvemmmxav0bgt6wx7t.jpg\\\"]\",\"genre\":\"[\\\"Role-playing (RPG)\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 4\\\",\\\"Xbox One\\\"]\",\"publisher\":\"[\\\"WB Games\\\",\\\"Bandai Namco Entertainment\\\",\\\"cdp.pl\\\",\\\"1C Company\\\",\\\"Spike ChunSoft\\\"]\",\"developer\":\"[\\\"CD Projekt RED\\\"]\",\"franchise\":\"[\\\"The Witcher\\\"]\",\"series\":\"\\\"The Witcher\\\"\",\"game_modes\":\"[\\\"Single player\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Fantasy\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"Minecraft\\\",\\\"The Elder Scrolls V: Skyrim\\\",\\\"Dishonored\\\",\\\"Brothers: A Tale of Two Sons\\\",\\\"Pillars of Eternity\\\",\\\"Dragon Age: Inquisition\\\",\\\"Middle-earth: Shadow of Mordor\\\",\\\"Aarklash: Legacy\\\",\\\"The Cat Lady\\\"]\",\"player_perspectives\":\"[\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"Ведьмак 3: Дикая охота\\\",\\\"Wiedźmin 3: Dziki Gon\\\",\\\"The Witcher 3: Wilde Jagd\\\",\\\"더 위쳐 3: 와일드 헌트\\\",\\\"巫师3：狂猎\\\",\\\"Zaklínač 3: Divoký Hon\\\",\\\"The Witcher III: Wild Hunt\\\",\\\"ウィッチャー3 ワイルドハント\\\"]\"},{\"userid\":2,\"gameid\":472,\"id\":472,\"name\":\"The Elder Scrolls V: Skyrim\",\"description\":\"The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.  \\n \\nPlay any type of character you can imagine, and do whatever you want; the legendary freedom of choice, storytelling, and adventure of The Elder Scrolls is realized like never before.  \\n \\nSkyrim’s new game engine brings to life a complete virtual world with rolling clouds, rugged mountains, bustling cities, lush fields, and ancient dungeons.  \\n \\nChoose from hundreds of weapons, spells, and abilities. The new character system allows you to play any way you want and define yourself through your actions.  \\n \\nBattle ancient dragons like you’ve never seen. As Dragonborn, learn their secrets and harness their power for yourself.\",\"cover\":\"game_images/game472.jpg\",\"release_date\":\"2011-11-11T05:00:00.000Z\",\"follows\":1024,\"rating_count\":2196,\"rating_average\":\"91.913\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/muv70yw3rds1cw8ymr5v.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/xzk2h41fiye7uwbhc6ub.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/urqw7ltwmhr39gkidsih.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/t0mus35qrgclafo1ql8k.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/x5bbaqvgbpaz4hzlfeqb.jpg\\\"]\",\"genre\":\"[\\\"Role-playing (RPG)\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 3\\\",\\\"Xbox 360\\\"]\",\"publisher\":\"[\\\"Bethesda Softworks\\\"]\",\"developer\":\"[\\\"Bethesda Game Studios\\\"]\",\"franchise\":null,\"series\":\"\\\"The Elder Scrolls\\\"\",\"game_modes\":\"[\\\"Single player\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Fantasy\\\",\\\"Sandbox\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"The Elder Scrolls III: Morrowind\\\",\\\"The Elder Scrolls IV: Oblivion\\\",\\\"Minecraft\\\",\\\"Dishonored\\\",\\\"Bioshock Infinite\\\",\\\"Planescape: Torment\\\",\\\"The Elder Scrolls Online\\\",\\\"The Witcher 3: Wild Hunt\\\",\\\"Middle-earth: Shadow of Mordor\\\"]\",\"player_perspectives\":\"[\\\"First person\\\",\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"TESV\\\",\\\"Skyrim\\\",\\\"TESV: Skyrim\\\",\\\"The Elder Scrolls 5: Skyrim\\\",\\\"TESV Skyrim\\\",\\\"TES5 Skyrim\\\",\\\"TES5: Skyrim\\\",\\\"TES5\\\",\\\"TES 5\\\",\\\"TES Skyrim\\\",\\\"The Elder Scrolls V: Skyrim Special Edition\\\",\\\"Dawnguard\\\",\\\"TES5\\\",\\\"The Elder Scrolls 5: Skyrim\\\",\\\"Skyrim\\\",\\\"TESV: Skyrim\\\"]\"}]"
            },
            {
              "userid": 2,
              "messageid": 2,
              "title": "username2 Sent You Their Wishlist",
              "message": "[{\"userid\":2,\"gameid\":1020,\"id\":1020,\"name\":\"Grand Theft Auto V\",\"description\":\"The biggest, most dynamic and most diverse open world ever created, Grand Theft Auto V blends storytelling and gameplay in new ways as players repeatedly jump in and out of the lives of the game’s three lead characters, playing all sides of the game’s interwoven story.\",\"cover\":\"game_images/game1020.jpg\",\"release_date\":\"2013-09-17T04:00:00.000Z\",\"follows\":1698,\"rating_count\":2818,\"rating_average\":\"93.423\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/o7q3ikzmkjxbftrd64ok.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/vfdeo6kgu0o4cyzd0sng.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/eepecmqsq6uqxiaukar1.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/hjnzngnrtwr82jzmmkef.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/glvmulyejlde31q8b70z.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/n3t2agwuxlqggp3kryf9.jpg\\\"]\",\"genre\":\"[\\\"Shooter\\\",\\\"Racing\\\",\\\"Sport\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 3\\\",\\\"Xbox 360\\\",\\\"PlayStation 4\\\",\\\"Xbox One\\\"]\",\"publisher\":\"[\\\"Rockstar Games\\\",\\\"Take-Two Interactive\\\"]\",\"developer\":\"[\\\"Rockstar North\\\"]\",\"franchise\":null,\"series\":\"\\\"GTA\\\"\",\"game_modes\":\"[\\\"Single player\\\",\\\"Multiplayer\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Comedy\\\",\\\"Sandbox\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"Mafia II\\\",\\\"L.A. Noire\\\",\\\"Grand Theft Auto: Vice City\\\",\\\"Max Payne 3\\\",\\\"Watch_Dogs\\\",\\\"Spec Ops: The Line\\\",\\\"Murdered: Soul Suspect\\\",\\\"Grand Theft Auto: Vice City Stories\\\",\\\"Watch Dogs 2\\\"]\",\"player_perspectives\":\"[\\\"First person\\\",\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"グランド・セフト・オートV\\\",\\\"그랜드 테프트 오토 V\\\",\\\"俠盜獵車手 5\\\",\\\"GTA5\\\",\\\"GTAV\\\",\\\"Grand Theft Auto Online\\\",\\\"GTA 5\\\",\\\"GTA V\\\",\\\"Grand Theft Auto 5\\\"]\"},{\"userid\":2,\"gameid\":1942,\"id\":1942,\"name\":\"The Witcher 3: Wild Hunt\",\"description\":\"RPG and sequel to The Witcher 2 (2011), The Witcher 3 follows witcher Geralt of Rivia as he seeks out his former lover and his young subject while intermingling with the political workings of the wartorn Northern Kingdoms. Geralt has to fight monsters and deal with people of all sorts in order to solve complex problems and settle contentious disputes, each ranging from the personal to the world-changing.\",\"cover\":\"game_images/game1942.jpg\",\"release_date\":\"2015-05-19T04:00:00.000Z\",\"follows\":1464,\"rating_count\":2494,\"rating_average\":\"93.714\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/mnljdjtrh44x4snmierh.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/em1y2ugcwy2myuhvb9db.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/usxccsncekxg0wd1v6ee.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/z5t0yuhyiiui1ickwhgj.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/farvemmmxav0bgt6wx7t.jpg\\\"]\",\"genre\":\"[\\\"Role-playing (RPG)\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 4\\\",\\\"Xbox One\\\"]\",\"publisher\":\"[\\\"WB Games\\\",\\\"Bandai Namco Entertainment\\\",\\\"cdp.pl\\\",\\\"1C Company\\\",\\\"Spike ChunSoft\\\"]\",\"developer\":\"[\\\"CD Projekt RED\\\"]\",\"franchise\":\"[\\\"The Witcher\\\"]\",\"series\":\"\\\"The Witcher\\\"\",\"game_modes\":\"[\\\"Single player\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Fantasy\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"Minecraft\\\",\\\"The Elder Scrolls V: Skyrim\\\",\\\"Dishonored\\\",\\\"Brothers: A Tale of Two Sons\\\",\\\"Pillars of Eternity\\\",\\\"Dragon Age: Inquisition\\\",\\\"Middle-earth: Shadow of Mordor\\\",\\\"Aarklash: Legacy\\\",\\\"The Cat Lady\\\"]\",\"player_perspectives\":\"[\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"Ведьмак 3: Дикая охота\\\",\\\"Wiedźmin 3: Dziki Gon\\\",\\\"The Witcher 3: Wilde Jagd\\\",\\\"더 위쳐 3: 와일드 헌트\\\",\\\"巫师3：狂猎\\\",\\\"Zaklínač 3: Divoký Hon\\\",\\\"The Witcher III: Wild Hunt\\\",\\\"ウィッチャー3 ワイルドハント\\\"]\"},{\"userid\":2,\"gameid\":472,\"id\":472,\"name\":\"The Elder Scrolls V: Skyrim\",\"description\":\"The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.  \\n \\nPlay any type of character you can imagine, and do whatever you want; the legendary freedom of choice, storytelling, and adventure of The Elder Scrolls is realized like never before.  \\n \\nSkyrim’s new game engine brings to life a complete virtual world with rolling clouds, rugged mountains, bustling cities, lush fields, and ancient dungeons.  \\n \\nChoose from hundreds of weapons, spells, and abilities. The new character system allows you to play any way you want and define yourself through your actions.  \\n \\nBattle ancient dragons like you’ve never seen. As Dragonborn, learn their secrets and harness their power for yourself.\",\"cover\":\"game_images/game472.jpg\",\"release_date\":\"2011-11-11T05:00:00.000Z\",\"follows\":1024,\"rating_count\":2196,\"rating_average\":\"91.913\",\"screenshots\":\"[\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/muv70yw3rds1cw8ymr5v.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/xzk2h41fiye7uwbhc6ub.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/urqw7ltwmhr39gkidsih.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/t0mus35qrgclafo1ql8k.jpg\\\",\\\"images.igdb.com/igdb/image/upload/t_screenshot_big_2x/x5bbaqvgbpaz4hzlfeqb.jpg\\\"]\",\"genre\":\"[\\\"Role-playing (RPG)\\\",\\\"Adventure\\\"]\",\"platform\":\"[\\\"PC (Microsoft Windows)\\\",\\\"PlayStation 3\\\",\\\"Xbox 360\\\"]\",\"publisher\":\"[\\\"Bethesda Softworks\\\"]\",\"developer\":\"[\\\"Bethesda Game Studios\\\"]\",\"franchise\":null,\"series\":\"\\\"The Elder Scrolls\\\"\",\"game_modes\":\"[\\\"Single player\\\"]\",\"themes\":\"[\\\"Action\\\",\\\"Fantasy\\\",\\\"Sandbox\\\",\\\"Open world\\\"]\",\"similar_games\":\"[\\\"The Elder Scrolls III: Morrowind\\\",\\\"The Elder Scrolls IV: Oblivion\\\",\\\"Minecraft\\\",\\\"Dishonored\\\",\\\"Bioshock Infinite\\\",\\\"Planescape: Torment\\\",\\\"The Elder Scrolls Online\\\",\\\"The Witcher 3: Wild Hunt\\\",\\\"Middle-earth: Shadow of Mordor\\\"]\",\"player_perspectives\":\"[\\\"First person\\\",\\\"Third person\\\"]\",\"alternative_names\":\"[\\\"TESV\\\",\\\"Skyrim\\\",\\\"TESV: Skyrim\\\",\\\"The Elder Scrolls 5: Skyrim\\\",\\\"TESV Skyrim\\\",\\\"TES5 Skyrim\\\",\\\"TES5: Skyrim\\\",\\\"TES5\\\",\\\"TES 5\\\",\\\"TES Skyrim\\\",\\\"The Elder Scrolls V: Skyrim Special Edition\\\",\\\"Dawnguard\\\",\\\"TES5\\\",\\\"The Elder Scrolls 5: Skyrim\\\",\\\"Skyrim\\\",\\\"TESV: Skyrim\\\"]\"}]"
            }
          ]
    }
    getMessageList() {
        return this.messageList;
    }
    init(element) {
        this.render(element);
        getData('/user/messages')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject('HTTP STATUS CODE: ' + response.status);
                }
            })
            .then(data => {
                this.messageList = data;
                this.render(element);
            })
            .catch(error => console.log('error is', error));
    }
    deleteItem(element, messageID) {
        // set username and userID (not use, since endpoint only uses 1)
        // makes post request to remove given message & rerenders
        postData('/user/messages/remove', { 'messageID': messageID })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject('HTTP STATUS CODE: ' + response.status);
                }
            })
            .then(data => {
                this.messageList = data;
                this.render(element);
            })
            .catch(error => console.log('error is', error));
    }
    /* Card Example (for reference):
      <div id=${message.id} class="card border-dark mb-3">
        <div class="card-header"></div>
        <div class="card-body text-dark">
          <h5 class="card-title"><a href="#">${message.title}</a></h5>
          <p class="card-text">${message.message}</p>
          <button id="mybtn ${message.id}" type="button" class="btn btn-danger float-sm-right"><i class="fa fa-trash"></i></button>
        </div>
      </div>
    */
    render(element) {
        function renderGameList(element, gameList) {
            element.innerHTML = "";
            const outerIndex = Math.ceil(gameList.length / 3);
            // First for loop is the number of rows of cards, second for loop creates 3 cards per row
            let counter = 0;
            for (let j = 0; j < outerIndex; j++) {
                // Create card div for row
                const cardRowDiv = document.createElement('div');
                cardRowDiv.classList.add('card-deck', 'row', 'mb-3', 'cardRow');
                for (let i = 0; i < 3; i++) {
                    if (gameList[counter] === undefined) {
                        break;
                    }
                    // Create main card div per card
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('card', "mh-50", "mw-25", "p-3");
                    cardDiv.id = gameList[counter].id;

                    // Create div for game card image
                    const pictureLink = document.createElement('a');
                    const hrefLink = "game_overlay.html?gameID=" + gameList[counter].id;
                    pictureLink.href = hrefLink;
                    const image = document.createElement('img');
                    image.classList.add('card-img-top');
                    if (gameList[counter].cover !== null) {
                        const imageFilePath = '../images/' + gameList[counter].cover;
                        image.src = imageFilePath;
                    }
                    pictureLink.appendChild(image);
                    cardDiv.appendChild(pictureLink);

                    // Create div for game card body
                    const cardBodyDiv = document.createElement('div');
                    cardBodyDiv.classList.add('card-body');

                    // Add game title to game card body
                    const titleLink = document.createElement('a');
                    titleLink.href = hrefLink;
                    const cardTitle = document.createElement('h5');
                    cardTitle.classList.add('card-title');
                    const title = document.createTextNode(gameList[counter].name);
                    cardTitle.appendChild(title);
                    titleLink.appendChild(cardTitle);
                    cardBodyDiv.appendChild(titleLink);

                    // Add description to game card body
                    const gameDescription = document.createElement('p');
                    gameDescription.classList.add('card-text');
                    const descriptionText = gameList[counter].description;
                    let truncatedText;
                    if (descriptionText !== null) {
                        if (descriptionText.split(' ').length > 30) {
                            truncatedText = descriptionText.split(" ").splice(0, 30).join(" ");
                            truncatedText = truncatedText + '...';
                        } else {
                            truncatedText = descriptionText;
                        }
                    } else {
                        truncatedText = '';
                    }
                    const description = document.createTextNode(truncatedText);
                    gameDescription.appendChild(description);
                    cardBodyDiv.appendChild(gameDescription);

                    // Create ratings div and insert rating label
                    if ("rating" in gameList[counter]) {
                        const ratingsDiv = document.createElement('div');
                        ratingsDiv.classList.add('d-flex', 'flex-row', 'flex-wrap');
                        const ratingLabel = document.createElement('p');
                        ratingLabel.classList.add('mr-3');
                        const textRatingLabel = document.createTextNode('Your Rating: ');
                        ratingLabel.appendChild(textRatingLabel);
                        ratingsDiv.appendChild(ratingLabel);
    
                        // round goldStar to nearest one out of five.
                        // let goldStarNum = Math.ceil(parseInt(gameList[counter].rating_average, 10) / 20);
                        let goldStarNum = gameList[counter].rating;
                        // Create card game rating stars
                        for (let starCount = 1; starCount <= 5; starCount++){
                            const starDiv = document.createElement('div');
                            starDiv.classList.add('fa', 'fa-star', 'mt-1', 'mb-2');
                            if (goldStarNum > 0) {
                                starDiv.style.color = 'gold';
                                goldStarNum--;
                            }
                            ratingsDiv.appendChild(starDiv);
                        }
                        // Create div to put rating and wishlist buttons at bottom of card
                        const bottomCard = document.createElement('div');
                        bottomCard.classList.add('bottomGameCard', 'mb-1');
                        cardBodyDiv.appendChild(bottomCard);
                        // Add ratings div to card body div
                        bottomCard.appendChild(ratingsDiv);
                    }

                    // Add single card div to row of cards
                    cardDiv.appendChild(cardBodyDiv);
                    cardRowDiv.appendChild(cardDiv);

                    counter++;
                }
                // Add rows of game cards to container of game card rows    
                element.appendChild(cardRowDiv);
            }

        }
        console.log(this.messageList)
        //  userID, messageID, title, message
        const fragment = document.createDocumentFragment();

        for (const message of this.messageList) {
            const gameObjList = JSON.parse(message.message);

            // messageCard - should be separate class...
            const messageWrapper = document.createElement('div');
            const cardElem = document.createElement('div');
            cardElem.classList.add("card", "border-dark", "mb-3");
            // header
            // const cardHeaderElem = document.createElement('div');
            // cardHeaderElem.classList.add("card-header");
            // cardHeaderElem.innerHTML = `<i class="fa fa-user fa-lg"></i> ${message.sender}`;
            // body wrapper
            const cardBodyElem = document.createElement('div');
            cardBodyElem.classList.add("card-body", "text-dark");
            // card body title
            const cardBodyTitleElem = document.createElement('h5');
            cardBodyTitleElem.classList.add("card-title");
            cardBodyTitleElem.appendChild(document.createTextNode(`${message.title}`)); // add link here?
            // card body message
            const cardBodyMessageElem = document.createElement('div');
            cardBodyMessageElem.classList.add('container', 'ml-4', 'mt-4');
            renderGameList(cardBodyMessageElem, gameObjList);

            // Old code from when message was String from 1 person to another
            // const cardBodyMessageElem = document.createElement('p');
            // cardBodyMessageElem.classList.add("card-text");
            // cardBodyMessageElem.appendChild(document.createTextNode(`${message.message}`)); // add link here?

            // card body button
            const cardBodyButtonElem = document.createElement('button');
            cardBodyButtonElem.classList.add("btn", "btn-danger", "float-sm-right");
            cardBodyButtonElem.setAttribute("id", `mybtn ${message.id}`);
            cardBodyButtonElem.innerHTML = `<i class="fa fa-trash"></i>`;
            cardBodyButtonElem.onclick = () => {
                this.deleteItem(element, message.messageid);
            };
            // add content to card body
            cardBodyElem.appendChild(cardBodyTitleElem);
            cardBodyElem.appendChild(cardBodyMessageElem);
            cardBodyElem.appendChild(cardBodyButtonElem);
            // add card header and body to card div 
            cardElem.appendChild(cardBodyElem);
            // add card div to wrapper
            messageWrapper.appendChild(cardElem);
            // add each card wrapper to document fragment
            fragment.appendChild(messageWrapper);
        }
        element.innerHTML = "";
        element.appendChild(fragment);
    }
}

window.addEventListener("load", async function () {
    const msgListElem = document.getElementById("messageList");
    const messageListComp = new MessagesList();
    messageListComp.init(msgListElem);
});

// CHANGE IT TO PROPER JS way (way too much of a pain)
