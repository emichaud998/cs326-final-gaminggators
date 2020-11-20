'use strict';

import {filterSideBarSetup, autocompleteSetup, closeAllLists, openFilterTab, showRatingFilter, filterButtonClear, ratingFilterApply, ratingFilterClear, clearAllFilters, gameSearch, applySelectedFilters} from './filtering.js';
import {sortTitle, sortPopularity, sortReleaseDate} from './sorting.js';
import {clickStar, ratingSubmit, wishlistAdd, fetchGameList, fetchUserRating, fetchGameFilterList} from './helpers.js';

const gameList = [
    {
      id: '85180',
      cover: 'http://placeimg.com/640/480/fashion',
      name: 'Practical Plastic Cheese',
      genre: [ 'Point-and-click', 'Real Time Strategy (RTS)' ],
      platform: [ 'Chicken', 'Chips', 'Table' ],
      franchise: [ 'Health', 'Books' ],
      developers: [ 'Spinka - Hoppe' ],
      publishers: [ 'Tremblay - Lebsack' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 5,
      gamemodes: [ 'Tasty', 'Handmade', 'Rustic', 'Practical' ],
      keywords: [
        'Forward',
        'connect',
        'Dynamic',
        'Shoes',
        'Representative',
        'Rubber'
      ],
      screenshots: [
        'http://placeimg.com/640/480/food',
        'http://placeimg.com/640/480/fashion'
      ],
      description: 'Maiores est sed doloribus maiores voluptatem sit iure nisi. Quo laborum sed ut dolor. Magni ut voluptatum. Neque nam saepe facere beatae vel reiciendis molestias aut. Rerum voluptatem iusto voluptatum atque iure et. Nesciunt quos et. Animi natus dolorem.'
    },
    {
      id: '92301',
      cover: 'http://placeimg.com/640/480/animals',
      name: 'Fantastic Concrete Keyboard',
      genre: [ 'Point-and-click', 'Turn-based-strategy(TBS)', 'MOBA' ],
      platform: [ 'Chair' ],
      franchise: [ 'Kids', 'Games', 'Outdoors' ],
      developers: [ 'Boyer - Von' ],
      publishers: [ 'Ondricka Inc', 'Lesch Group' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Fantastic', 'Practical', 'Handcrafted' ],
      keywords: [
        'Switchable',   'maroon',
        'Grocery',      'Indiana',
        'Home',         'transmitting',
        'Principal',    'Sleek',
        'productivity', 'District'
      ],
      screenshots: [
        'http://placeimg.com/640/480/technics',
        'http://placeimg.com/640/480/fashion',
        'http://placeimg.com/640/480/people'
      ],
      description: 'Veniam sunt ratione. Aperiam alias quis voluptatem quo enim repellendus perspiciatis laborum quam. Voluptatem officia et recusandae minus unde. Qui voluptatibus voluptatum magni possimus est similique quod rerum. Labore eos earum ab quaerat. Sequi veniam a aut adipisci doloribus officia. Eius cupiditate omnis. Veniam non nobis odio fugit asperiores.'
    },
    {
      id: '34251',
      cover: 'http://placeimg.com/640/480/sports',
      name: 'Intelligent Frozen Table',
      genre: [ 'Quiz/Trivia', 'Music', 'Arcade', 'Racing' ],
      platform: [ 'Soap', 'Hat', 'Chair' ],
      franchise: [ 'Games', 'Industrial', 'Grocery' ],
      developers: [ 'Hudson - Littel' ],
      publishers: [ 'Cummings, Pfannerstill and Trantow', 'Reilly, Stehr and Marks' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 1,
      gamemodes: [ 'Practical', 'Ergonomic', 'Small', 'Intelligent' ],
      keywords: [
        'AGP',
        'Mountain',
        'logistical',
        'Granite',
        'Berkshire',
        'protocol',
        'SQL',
        'Palestinian',
        'Tools'
      ],
      screenshots: [ 'http://placeimg.com/640/480/fashion' ],
      description: 'Incidunt qui tenetur aut quaerat. Quibusdam ut ut voluptate reiciendis voluptas asperiores molestiae placeat. Recusandae tempora assumenda. Aliquid est optio adipisci vel fugiat in reprehenderit et. Sapiente mollitia deserunt assumenda sit quis perspiciatis aperiam.'
    },
    {
      id: '61296',
      cover: 'http://placeimg.com/640/480/fashion',
      name: 'Generic Rubber Gloves',
      genre: [ 'Role-playing (RPG)' ],
      platform: [ 'Bacon', 'Salad', 'Shoes' ],
      franchise: [ 'Baby' ],
      developers: [ 'Hettinger, Hintz and Ledner', 'Hilll, Mayert and Lebsack' ],
      publishers: [ 'Casper LLC' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 3,
      gamemodes: [ 'Tasty', 'Generic', 'Ergonomic', 'Small' ],
      keywords: [ 'productize' ],
      screenshots: [
        'http://placeimg.com/640/480/business',
        'http://placeimg.com/640/480/people',
        'http://placeimg.com/640/480/animals',
        'http://placeimg.com/640/480/abstract',
        'http://placeimg.com/640/480/city'
      ],
      description: 'Molestiae suscipit modi facere. Quo nostrum deleniti. Reiciendis tenetur alias non id nam hic itaque expedita quam. Occaecati quia possimus sapiente dicta iste quos voluptas dolorem. Architecto laboriosam quibusdam aut voluptatum quasi omnis similique et quia. Cupiditate nobis ullam voluptate assumenda quibusdam. Vitae quam voluptatem nulla deserunt. Non a ducimus et facilis aut corrupti tempore facere accusamus.'
    },
    {
      id: '44286',
      cover: 'http://placeimg.com/640/480/food',
      name: 'Incredible Concrete Sausages',
      genre: [ 'Indie', 'Simulator', 'Visual Novel' ],
      platform: [ 'Salad', 'Chair' ],
      franchise: [ 'Jewelery', 'Outdoors' ],
      developers: [
        'Wiegand, Boyle and Welch',
        "D'Amore - Fritsch",
        'Rippin - Beatty'
      ],
      publishers: [ 'Dare Group', 'Hills Inc' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 1,
      gamemodes: [ 'Unbranded', 'Awesome' ],
      keywords: [
        'leading-edge',
        'Creative',
        'high-level',
        'Wooden',
        'Object-based'
      ],
      screenshots: [
        'http://placeimg.com/640/480/technics',
        'http://placeimg.com/640/480/sports',
        'http://placeimg.com/640/480/business',
        'http://placeimg.com/640/480/cats',
        'http://placeimg.com/640/480/animals'
      ],
      description: 'Velit quasi aspernatur iure aliquam quis quos iste. Dignissimos et ea voluptates. Maxime quia excepturi quaerat tempora cupiditate consequatur aliquid sit. Deserunt similique reiciendis itaque. Repudiandae autem incidunt expedita qui et. Delectus explicabo voluptas. Voluptate voluptas est. Quam facere ducimus veritatis sed quae laboriosam.'
    },
    {
      id: '11019',
      cover: 'http://placeimg.com/640/480/fashion',
      name: 'Awesome Granite Hat',
      genre: [ 'Role-playing (RPG)', 'Sport' ],
      platform: [ 'Towels', 'Cheese' ],
      franchise: [ 'Clothing', 'Automotive' ],
      developers: [ 'Herman - Waters' ],
      publishers: [ 'Crona and Sons' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 4,
      gamemodes: [ 'Tasty', 'Handcrafted' ],
      keywords: [ 'Riel', 'Pre-emptive' ],
      screenshots: [
        'http://placeimg.com/640/480/transport',
        'http://placeimg.com/640/480/business',
        'http://placeimg.com/640/480/fashion'
      ],
      description: 'Similique nulla inventore sit ratione commodi soluta. Ipsa qui iusto molestias eum veritatis cupiditate autem. Fugiat voluptatibus eum quae atque delectus delectus sint. Voluptatem amet occaecati ducimus ut. Voluptatem a ipsum commodi id reiciendis at id.'
    },
    {
      id: '47680',
      cover: 'http://placeimg.com/640/480/nightlife',
      name: 'Generic Plastic Keyboard',
      genre: [ 'Role-playing (RPG)', 'Shooter' ],
      platform: [ 'Car', 'Shoes', 'Gloves' ],
      franchise: [ 'Garden', 'Health', 'Toys' ],
      developers: [ 'Smitham - Koepp', 'Huel, Kirlin and Lebsack' ],
      publishers: [ 'Rempel Group', 'Kuphal and Sons' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Generic', 'Gorgeous', 'Handcrafted' ],
      keywords: [
        'Nevada',
        'capacitor',
        'Loan',
        'Cambridgeshire',
        'online',
        'Euro',
        'turn-key'
      ],
      screenshots: [
        'http://placeimg.com/640/480/people',
        'http://placeimg.com/640/480/technics',
        'http://placeimg.com/640/480/sports',
        'http://placeimg.com/640/480/transport'
      ],
      description: 'Expedita ex autem non corporis. Officiis voluptatem qui. Quo dolores dolor sunt nobis distinctio corporis dolorem et esse. Culpa quae asperiores quia aut ullam iusto molestiae illum. Quam ipsum minus ipsa omnis nam doloribus natus ut. Quo ut quo tempore vel. Culpa ea omnis.'
    },
    {
      id: '81951',
      cover: 'http://placeimg.com/640/480/nightlife',
      name: 'Licensed Granite Table',
      genre: [ 'Card & Board Game' ],
      platform: [ 'Sausages', 'Hat', 'Shirt' ],
      franchise: [ 'Garden', 'Shoes' ],
      developers: [ 'Maggio, Beahan and Abshire', 'Abshire - Carter' ],
      publishers: [ 'Beatty Inc' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Rustic', 'Practical', 'Fantastic', 'Ergonomic' ],
      keywords: [ 'specifically', 'Gloves', 'content', 'demand-driven', 'Account' ],
      screenshots: [
        'http://placeimg.com/640/480/business',
        'http://placeimg.com/640/480/food',
        'http://placeimg.com/640/480/nightlife',
        'http://placeimg.com/640/480/people'
      ],
      description: 'Quod vel rerum cumque aliquid sint occaecati explicabo. Rerum sunt deleniti aut amet ut ut quas aliquam. At fugit est dolores animi delectus quis cumque. Nam exercitationem corrupti qui aut culpa. At maxime voluptas vitae alias fugit suscipit facere. Eum odio eum quam eius totam et aut molestias modi.'
    },
    {
      id: '43392',
      cover: 'http://placeimg.com/640/480/city',
      name: 'Tasty Granite Fish',
      genre: [ 'Music', 'Sport' ],
      platform: [ 'Chips', 'Car' ],
      franchise: [ 'Jewelery', 'Movies', 'Tools' ],
      developers: [ 'Schultz Group' ],
      publishers: [ 'Moore, Macejkovic and Frami', 'Leannon - Kuhlman' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Gorgeous' ],
      keywords: [
        'ADP',         'solid',
        'quantifying', 'Botswana',
        'Avon',        'Carolina',
        'virtual',     'Gorgeous',
        'deposit'
      ],
      screenshots: [
        'http://placeimg.com/640/480/animals',
        'http://placeimg.com/640/480/transport'
      ],
      description: 'Assumenda accusamus eaque expedita nihil. Eligendi beatae neque sed provident ratione. Eos ipsa voluptatem beatae. Facilis exercitationem animi dolorum eos eum rerum. Et doloribus impedit. Quas eligendi ut. Voluptatem rerum ut omnis. Cumque eius dolorem amet facilis eum sit id corrupti quo.'
    },
    {
      id: '79353',
      cover: 'http://placeimg.com/640/480/technics',
      name: 'Rustic Cotton Pants',
      genre: [ 'Turn-based-strategy(TBS)', 'Adventure', 'Quiz/Trivia', 'Music' ],
      platform: [ 'Chips' ],
      franchise: [ 'Industrial' ],
      developers: [ 'Gutkowski LLC', 'Abshire - Gutkowski' ],
      publishers: [ 'McClure and Sons', 'Harber LLC' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 5,
      gamemodes: [ 'Tasty', 'Licensed' ],
      keywords: [
        'withdrawal',
        'indigo',
        'deposit',
        'Investment',
        'Cheese',
        'Oregon'
      ],
      screenshots: [ 'http://placeimg.com/640/480/technics' ],
      description: 'Soluta repudiandae vel eos. Quis sapiente aut consequatur molestiae. Veniam dolorum repudiandae quam porro. Possimus iste reprehenderit porro ut. Harum odio sit voluptatibus ex eum ut et soluta. Qui exercitationem rerum eos. Eos quia delectus minus est eius qui. Consequuntur animi sequi vitae nemo voluptatem veniam iste illum quibusdam.'
    },
    {
      id: '60510',
      cover: 'http://placeimg.com/640/480/people',
      name: 'Generic Rubber Chips',
      genre: [
        'Real Time Strategy (RTS)',
        'Turn-based-strategy(TBS)',
        'Racing'
      ],
      platform: [ 'Towels' ],
      franchise: [ 'Grocery' ],
      developers: [ 'Collins - Schowalter', 'Lind, Hoeger and Luettgen' ],
      publishers: [ 'Purdy, Spencer and Howe', "O'Kon - Parisian" ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 3,
      gamemodes: [ 'Ergonomic', 'Gorgeous' ],
      keywords: [ 'real-time', 'Handmade', 'Indiana', 'Incredible' ],
      screenshots: [
        'http://placeimg.com/640/480/transport',
        'http://placeimg.com/640/480/fashion',
        'http://placeimg.com/640/480/technics'
      ],
      description: 'Minus illum quasi dolorem adipisci. Odit cumque est officiis iusto. Laborum vel dolorem corporis ea. Distinctio rerum sed totam debitis. Ullam assumenda vel dolore vitae voluptatem harum accusamus voluptatem.'
    },
    {
      id: '34245',
      cover: 'http://placeimg.com/640/480/abstract',
      name: 'Handmade Soft Keyboard',
      genre: [ 'Point-and-click', 'Adventure' ],
      platform: [ 'Pants', 'Shirt', 'Cheese' ],
      franchise: [ 'Home', 'Computers', 'Grocery' ],
      developers: [ 'Johnson, Pfeffer and Graham' ],
      publishers: [ 'Goyette Inc', 'Rohan, Runolfsson and Bradtke' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 5,
      gamemodes: [ 'Unbranded', 'Ergonomic', 'Awesome' ],
      keywords: [
        'wireless',     'lime',
        'Fiji',         'Avon',
        'Leone',        'compressing',
        'Interactions', 'invoice',
        'Estates',      'Shoes'
      ],
      screenshots: [
        'http://placeimg.com/640/480/cats',
        'http://placeimg.com/640/480/nightlife'
      ],
      description: 'Debitis sint voluptatem ratione quia rem voluptatibus. Nesciunt non quia blanditiis cupiditate excepturi ratione cum velit. Perspiciatis incidunt architecto. Cupiditate ducimus enim architecto perspiciatis tempore suscipit. Saepe ipsum iste voluptates. Doloremque est amet qui nihil voluptas delectus. Vel dolores impedit nihil.'
    },
    {
      id: '13787',
      cover: 'http://placeimg.com/640/480/people',
      name: 'Practical Plastic Cheese',
      genre: [ 'Music', "Hack and slash/Beat 'em up", 'Point-and-click' ],
      platform: [ 'Cheese' ],
      franchise: [ 'Electronics', 'Sports' ],
      developers: [
        'Predovic, Schimmel and Hackett',
        'Prosacco Group',
        'Runolfsdottir and Sons'
      ],
      publishers: [ 'Friesen - Gislason' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 3,
      gamemodes: [ 'Incredible', 'Gorgeous' ],
      keywords: [
        'Soft',
        'Shirt',
        'Rubber',
        'Self-enabling',
        'Grocery',
        'calculate',
        'withdrawal',
        'Re-contextualized'
      ],
      screenshots: [
        'http://placeimg.com/640/480/sports',
        'http://placeimg.com/640/480/food',
        'http://placeimg.com/640/480/city'
      ],
      description: 'Et enim molestiae fuga aut at et error fugiat voluptatem. Quidem quia eos. Sit delectus aliquid consequatur a aliquam voluptatem. Magni possimus est dolorem ut officiis. Non quo non perferendis recusandae. Sed omnis vel autem et omnis. Ratione totam ut nihil quis.'
    },
    {
      id: '65807',
      cover: 'http://placeimg.com/640/480/food',
      name: 'Handcrafted Concrete Pants',
      genre: [
        'Racing',
        'Role-playing (RPG)',
        'MOBA',
        'Real Time Strategy (RTS)'
      ],
      platform: [ 'Keyboard', 'Gloves', 'Soap' ],
      franchise: [ 'Home', 'Movies', 'Books' ],
      developers: [ 'Effertz Inc', 'Ryan, Feest and Veum', 'Berge - Lehner' ],
      publishers: [ 'Hamill, Kessler and Emmerich', 'Rippin Group' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Handcrafted', 'Sleek', 'Intelligent' ],
      keywords: [ 'Strategist', 'Soft' ],
      screenshots: [
        'http://placeimg.com/640/480/animals',
        'http://placeimg.com/640/480/abstract',
        'http://placeimg.com/640/480/fashion',
        'http://placeimg.com/640/480/cats',
        'http://placeimg.com/640/480/sports'
      ],
      description: 'Nobis id qui provident id exercitationem placeat veniam error. Assumenda eaque eaque sapiente enim nulla deserunt cum. Et vel non. Amet cum sunt itaque ducimus in ad. Illum hic error minima corporis delectus alias. Voluptas consectetur beatae aut itaque sit consectetur dolorum modi rerum. Qui id minus qui expedita et voluptas. Hic fugiat laboriosam nesciunt harum et aperiam ea.'
    },
    {
      id: '11067',
      cover: 'http://placeimg.com/640/480/animals',
      name: 'Generic Wooden Table',
      genre: [ 'Sport', 'Fighting', 'Puzzle', 'Racing' ],
      platform: [ 'Keyboard' ],
      franchise: [ 'Kids' ],
      developers: [
        'Reichel - Jenkins',
        'Romaguera Group',
        'Boyer, Terry and Schinner'
      ],
      publishers: [ 'Heathcote and Sons' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Incredible', 'Generic' ],
      keywords: [ 'architecture', 'Chief', 'Account', 'French', 'Refined' ],
      screenshots: [
        'http://placeimg.com/640/480/nature',
        'http://placeimg.com/640/480/business',
        'http://placeimg.com/640/480/transport',
        'http://placeimg.com/640/480/nightlife',
        'http://placeimg.com/640/480/fashion'
      ],
      description: 'Quibusdam ratione sapiente vitae cumque dicta enim blanditiis iure. Voluptas maiores natus aperiam sit perspiciatis ea quo ut consequatur. Ratione et similique accusamus. Quod eum similique inventore ipsam qui. Quaerat nesciunt magni rem delectus maxime.'
    },
    {
      id: '51978',
      cover: 'http://placeimg.com/640/480/city',
      name: 'Awesome Rubber Pizza',
      genre: [
        'Card & Board Game',
        'Role-playing (RPG)',
        'Platform',
        'Turn-based-strategy(TBS)'
      ],
      platform: [ 'Shoes', 'Chair', 'Car' ],
      franchise: [ 'Clothing', 'Outdoors' ],
      developers: [ 'Hessel, Glover and Sporer', 'Littel - Bernhard' ],
      publishers: [ 'Mohr, Boyle and Kshlerin' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 4,
      gamemodes: [ 'Practical' ],
      keywords: [ 'Interactions', 'Shoals' ],
      screenshots: [
        'http://placeimg.com/640/480/food',
        'http://placeimg.com/640/480/cats',
        'http://placeimg.com/640/480/technics',
        'http://placeimg.com/640/480/transport',
        'http://placeimg.com/640/480/sports'
      ],
      description: 'Et possimus nesciunt corrupti voluptas non sit aperiam molestiae vel. Dolor vel in at et. Vitae est qui et. Corporis et cupiditate. Tempora facere et ut voluptatem molestias ut est.'
    },
    {
      id: '44496',
      cover: 'http://placeimg.com/640/480/nightlife',
      name: 'Tasty Cotton Bike',
      genre: [ 'Simulator', 'Shooter', 'Point-and-click', 'Indie' ],
      platform: [ 'Chair' ],
      franchise: [ 'Music' ],
      developers: [ 'Lockman, Waelchi and Graham' ],
      publishers: [ 'Williamson - McCullough', 'Dach - Gerlach' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 4,
      gamemodes: [ 'Gorgeous', 'Sleek' ],
      keywords: [ 'feed', 'Mountains', 'high-level', 'Cotton', 'Creative' ],
      screenshots: [ 'http://placeimg.com/640/480/nightlife' ],
      description: 'Possimus sit in. Dolorem ex ut. Et vel blanditiis consectetur eum optio qui illum aperiam. Voluptatem sint mollitia non consequatur. Porro voluptatibus dignissimos facere. Corporis id libero earum minus occaecati eum vero. Qui iure eum possimus deserunt. Laboriosam omnis quia asperiores porro tenetur.'
    },
    {
      id: '12708',
      cover: 'http://placeimg.com/640/480/cats',
      name: 'Practical Cotton Chicken',
      genre: [ 'Pinball', 'Strategy', 'Simulator' ],
      platform: [ 'Pants' ],
      franchise: [ 'Automotive' ],
      developers: [ 'Kozey LLC', 'Mueller and Sons', 'Abbott Group' ],
      publishers: [ 'Kirlin LLC', 'Kuhlman and Sons' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 3,
      gamemodes: [ 'Tasty', 'Rustic', 'Intelligent', 'Generic' ],
      keywords: [ 'Product', 'invoice', 'Granite', 'Guadeloupe', 'Paradigm' ],
      screenshots: [ 'http://placeimg.com/640/480/nightlife' ],
      description: 'Et sit doloribus ea voluptas. Nobis dolores laudantium. Doloremque autem earum voluptatem et quasi magnam accusamus. Voluptates harum aut est. Dolor voluptates totam asperiores laboriosam et. Perspiciatis esse ut. Ea et voluptate provident totam rem.'
    },
    {
      id: '83458',
      cover: 'http://placeimg.com/640/480/nature',
      name: 'Fantastic Cotton Salad',
      genre: [ 'Indie' ],
      platform: [ 'Chicken', 'Shirt', 'Hat' ],
      franchise: [ 'Tools', 'Jewelery', 'Garden' ],
      developers: [ 'Homenick Group', 'Trantow - Bartoletti' ],
      publishers: [ 'Bauch - Kilback' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Unbranded', 'Handcrafted', 'Tasty', 'Fantastic' ],
      keywords: [
        'Progressive',
        'withdrawal',
        'exploit',
        'Cotton',
        'Chief',
        'programming',
        'object-oriented'
      ],
      screenshots: [
        'http://placeimg.com/640/480/city',
        'http://placeimg.com/640/480/abstract',
        'http://placeimg.com/640/480/nightlife',
        'http://placeimg.com/640/480/food',
        'http://placeimg.com/640/480/fashion'
      ],
      description: 'Animi et perspiciatis voluptates minima qui ratione ab aliquam. Odit et nulla nostrum beatae similique sequi sint. Aut est temporibus eos et omnis eum. Qui quo repudiandae consequatur modi et est. Iusto sed et et magni impedit voluptatem veniam.'
    },
    {
      id: '4512',
      cover: 'http://placeimg.com/640/480/nightlife',
      name: 'Tasty Concrete Shirt',
      genre: [ 'Point-and-click', 'Strategy', 'Visual Novel' ],
      platform: [ 'Chicken', 'Ball' ],
      franchise: [ 'Computers' ],
      developers: [ 'Cronin - Wiegand' ],
      publishers: [ 'Hammes - Hermiston' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 4,
      gamemodes: [ 'Fantastic', 'Unbranded', 'Handcrafted', 'Refined' ],
      keywords: [
        'Buckinghamshire',
        'Bedfordshire',
        'connect',
        'primary',
        'supply-chains',
        'Mouse',
        'Beauty',
        'networks'
      ],
      screenshots: [
        'http://placeimg.com/640/480/nightlife',
        'http://placeimg.com/640/480/nature',
        'http://placeimg.com/640/480/abstract',
        'http://placeimg.com/640/480/animals'
      ],
      description: 'Quas quia consectetur nostrum maxime. Voluptatem quo laudantium et soluta aspernatur atque voluptatum. Sed assumenda iste dolore non autem omnis. Voluptatibus illum officia quae enim porro rerum perferendis ratione. Aut cum voluptate et occaecati voluptatem est dignissimos. Modi qui fugiat at aspernatur dolor voluptatem assumenda. Consequuntur accusamus blanditiis quia quaerat quis et eos.'
    },
    {
      id: '81005',
      cover: 'http://placeimg.com/640/480/people',
      name: 'Tasty Granite Shirt',
      genre: [ 'Pinball' ],
      platform: [ 'Chips', 'Bacon', 'Keyboard' ],
      franchise: [ 'Home', 'Shoes' ],
      developers: [ 'Raynor LLC' ],
      publishers: [ 'Spencer LLC', 'Gutmann - Farrell' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 3,
      gamemodes: [ 'Awesome' ],
      keywords: [ 'extranet', 'Soft', 'Interactions', 'feed', 'maximize' ],
      screenshots: [
        'http://placeimg.com/640/480/cats',
        'http://placeimg.com/640/480/city'
      ],
      description: 'Delectus optio maxime et cum. Illo officiis expedita voluptas deserunt sed facilis voluptate aut autem. Est atque asperiores. Necessitatibus consequatur ut repellendus. Saepe ducimus iusto explicabo cupiditate possimus adipisci nulla rerum laboriosam. Dolor dolores sequi facilis.'
    },
    {
      id: '78547',
      cover: 'http://placeimg.com/640/480/abstract',
      name: 'Handmade Wooden Shoes',
      genre: [ 'Fighting', 'Point-and-click' ],
      platform: [ 'Gloves', 'Pants' ],
      franchise: [ 'Jewelery' ],
      developers: [ 'Krajcik, Robel and Botsford', 'Bergnaum - Kuphal' ],
      publishers: [ 'Steuber Inc', 'Dickens, Herman and Zboncak' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Handmade', 'Awesome' ],
      keywords: [
        'portals',
        'Creative',
        'SMS',
        'niches',
        'Cambridgeshire',
        'web',
        'redundant',
        'Shirt',
        'Cloned',
        'Tennessee'
      ],
      screenshots: [ 'http://placeimg.com/640/480/business' ],
      description: 'Quia amet nesciunt suscipit rem accusamus placeat vel accusamus tempora. Debitis aut vitae odit animi nisi quibusdam provident enim. Aperiam ut error saepe fugit fugiat. Sunt ea iure aut. Sunt tempora suscipit qui veniam nesciunt sed. Fugiat quos accusamus laboriosam eum ipsam aspernatur ex. Vel in assumenda ipsam eligendi. Dolor sit libero assumenda asperiores molestiae minima quibusdam cupiditate.'
    },
    {
      id: '66970',
      cover: 'http://placeimg.com/640/480/nightlife',
      name: 'Refined Plastic Hat',
      genre: [ 'Shooter', 'Simulator' ],
      platform: [ 'Bacon', 'Sausages' ],
      franchise: [ 'Kids', 'Automotive' ],
      developers: [ 'Hirthe Inc' ],
      publishers: [ 'Bogan - Bernier' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 4,
      gamemodes: [ 'Licensed' ],
      keywords: [
        'high-level',
        'blockchains',
        'architect',
        'Jersey',
        'Borders',
        'fuchsia'
      ],
      screenshots: [ 'http://placeimg.com/640/480/food' ],
      description: 'At sit voluptatem animi repellat nihil veritatis sit delectus veniam. Eos nisi voluptas repudiandae. Nisi similique architecto nulla esse delectus tempore. Atque eius quasi eum. Sit minus impedit earum rem exercitationem nihil. Quaerat neque repellat.'
    },
    {
      id: '29161',
      cover: 'http://placeimg.com/640/480/business',
      name: 'Unbranded Soft Fish',
      genre: [ 'MOBA', 'Simulator', 'Sport' ],
      platform: [ 'Shoes' ],
      franchise: [ 'Automotive', 'Games' ],
      developers: [ 'Daniel, Keebler and Kuphal', 'Kuhic Group' ],
      publishers: [ 'McClure - Herman', 'Hintz - Lesch' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 2,
      gamemodes: [ 'Refined', 'Small' ],
      keywords: [ 'overriding', 'support', 'up', 'multi-state', 'Architect' ],
      screenshots: [
        'http://placeimg.com/640/480/people',
        'http://placeimg.com/640/480/transport'
      ],
      description: 'Necessitatibus ipsa placeat porro vero earum. Deleniti qui ut possimus a vitae et fugiat consequatur illum. Atque maiores eos. Facere et soluta ex quibusdam quo hic doloribus vel similique. Fuga maxime rerum laboriosam similique autem aliquam quidem nulla dignissimos. Enim quibusdam vitae. Magnam vero illo non neque assumenda sed perferendis harum molestias.'
    },
    {
      id: '92295',
      cover: 'http://placeimg.com/640/480/food',
      name: 'Licensed Soft Pizza',
      genre: [ 'Simulator', 'Quiz/Trivia', 'Racing', 'Tactical' ],
      platform: [ 'Gloves' ],
      franchise: [ 'Industrial', 'Music', 'Games' ],
      developers: [
        'Bogan, Predovic and Beier',
        'Nikolaus, Schultz and Hilpert',
        'Bednar - Leuschke'
      ],
      publishers: [ 'Wilkinson - Morissette', 'Dach, Gorczany and Cruickshank' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 3,
      gamemodes: [ 'Gorgeous', 'Rustic', 'Ergonomic', 'Sleek' ],
      keywords: [
        'Investment',
        'calculating',
        'Accountability',
        'index',
        'Ruble',
        'architecture',
        'Austria'
      ],
      screenshots: [
        'http://placeimg.com/640/480/sports',
        'http://placeimg.com/640/480/fashion',
        'http://placeimg.com/640/480/abstract',
        'http://placeimg.com/640/480/business'
      ],
      description: 'Dolore quae quae sit consequatur temporibus est aut sequi. Eum explicabo et eum dolor eligendi omnis omnis illo. Excepturi inventore incidunt fugiat nam vel iure consequatur. Qui consequatur perspiciatis ut itaque aut. Cupiditate ut ducimus enim rerum rerum est exercitationem. Modi odio aut rem consequatur quia qui sunt eveniet autem. Ipsum nostrum eum aliquid autem distinctio doloribus.'
    },
    {
      id: '53389',
      cover: 'http://placeimg.com/640/480/business',
      name: 'Practical Steel Table',
      genre: [ 'Quiz/Trivia', 'Racing', 'Real Time Strategy (RTS)' ],
      platform: [ 'Tuna', 'Keyboard' ],
      franchise: [ 'Electronics' ],
      developers: [ "Aufderhar - O'Kon" ],
      publishers: [ 'Koepp, Gerlach and Rolfson' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 3,
      gamemodes: [ 'Awesome', 'Sleek' ],
      keywords: [ 'deploy', 'Card', 'Home', 'migration' ],
      screenshots: [
        'http://placeimg.com/640/480/cats',
        'http://placeimg.com/640/480/fashion'
      ],
      description: 'Vero temporibus tempora repellendus voluptates eaque rerum. Accusamus nisi ut blanditiis ex praesentium. Dolores ad distinctio et. Est minus sapiente ipsa ut. Architecto aut et numquam et amet aliquam minus. Ab eum et. Quis et voluptas autem est.'
    },
    {
      id: '96340',
      cover: 'http://placeimg.com/640/480/animals',
      name: 'Unbranded Cotton Salad',
      genre: [ 'Strategy', 'Sport', 'Fighting' ],
      platform: [ 'Bike', 'Bacon' ],
      franchise: [ 'Shoes', 'Baby', 'Health' ],
      developers: [ 'Fay - Heathcote' ],
      publishers: [ 'Pouros LLC' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 4,
      gamemodes: [ 'Ergonomic' ],
      keywords: [ 'Germany' ],
      screenshots: [ 'http://placeimg.com/640/480/city' ],
      description: 'Rerum aut saepe quia voluptas cum assumenda cum omnis unde. Minus possimus ut et et cum. Sit reprehenderit harum necessitatibus est alias assumenda et. Quibusdam alias nobis. Ut vitae ea dolorum autem velit deserunt voluptatem. Recusandae culpa ut minima dicta et quia libero cum. Quia cumque aut sit. Nemo enim rerum reiciendis.'
    },
    {
      id: '86915',
      cover: 'http://placeimg.com/640/480/people',
      name: 'Incredible Wooden Salad',
      genre: [ 'Arcade', 'Simulator', 'Puzzle' ],
      platform: [ 'Hat', 'Cheese' ],
      franchise: [ 'Kids', 'Electronics', 'Shoes' ],
      developers: [ 'Dicki LLC' ],
      publishers: [ 'Zulauf and Sons' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 5,
      gamemodes: [ 'Gorgeous' ],
      keywords: [
        'Kids',      'Ford',
        'Marketing', 'cross-media',
        'Credit',    'Auto',
        'Clothing',  'Alley',
        'metrics'
      ],
      screenshots: [
        'http://placeimg.com/640/480/nature',
        'http://placeimg.com/640/480/city'
      ],
      description: 'Nesciunt quam eum itaque non nisi officia facere quam. Omnis iste omnis a fuga velit odit adipisci. Soluta ut a. Aliquid qui tempora quis vitae qui est unde similique totam. Modi aliquam quaerat velit architecto dolor nesciunt. Quisquam sint deserunt dolores officiis non molestiae voluptas et. Ipsam totam sunt earum et et cupiditate.'
    },
    {
      id: '12554',
      cover: 'http://placeimg.com/640/480/sports',
      name: 'Awesome Concrete Bike',
      genre: [ 'Sport', 'Tactical', 'Role-playing (RPG)' ],
      platform: [ 'Car', 'Sausages', 'Mouse' ],
      franchise: [ 'Health', 'Outdoors', 'Kids' ],
      developers: [ 'Hammes Inc', 'Adams Inc' ],
      publishers: [ 'Blick Inc', 'Leannon - Bogan' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 1,
      gamemodes: [ 'Ergonomic', 'Gorgeous', 'Generic', 'Handmade' ],
      keywords: [ 'indexing' ],
      screenshots: [
        'http://placeimg.com/640/480/animals',
        'http://placeimg.com/640/480/city'
      ],
      description: 'Aut asperiores beatae sit perferendis commodi numquam repellendus in libero. Quisquam esse quia dolorem. Nisi est pariatur aliquam nostrum repudiandae. Similique commodi rerum esse temporibus. Asperiores qui dicta corrupti esse commodi aut fuga. Et voluptatibus soluta nulla debitis officia. Alias autem aut consequatur eos qui sint hic ut.'
    },
    {
      id: '60026',
      cover: 'http://placeimg.com/640/480/transport',
      name: 'Ergonomic Metal Bike',
      genre: [ 'Music', 'Indie', 'Strategy' ],
      platform: [ 'Sausages', 'Fish' ],
      franchise: [ 'Electronics', 'Automotive', 'Industrial' ],
      developers: [ 'Casper Group', 'Herman Inc' ],
      publishers: [ 'Corwin - Zulauf' ],
      releaseDate: new Date("2020-11-20T19:39:59.491Z"),
      ratingAverage: 1,
      gamemodes: [ 'Gorgeous', 'Generic', 'Refined' ],
      keywords: [
        'redundant',
        'structure',
        'generating',
        'orchid',
        'Kids',
        'best-of-breed'
      ],
      screenshots: [
        'http://placeimg.com/640/480/nature',
        'http://placeimg.com/640/480/nightlife'
      ],
      description: 'Et temporibus qui sed itaque eum quis. Minima voluptas voluptas. Et odio nobis adipisci occaecati. Molestias ullam tempore quidem maxime rerum vero nostrum adipisci aspernatur. Minus et maiores. Molestias facilis distinctio debitis porro hic molestiae ducimus consequuntur dicta. Error qui maiores est.'
    }
  ]
window.addEventListener('load', browseGamesStart);

async function browseGamesStart() {
    window.filters = [];
    sortPopularity(false);
    filterSideBarSetup();
    addEventListeners();
    document.getElementById('Genre_button').click();
    autocompleteSetup(false, true, false, '/games/allTitles');
    
    let pagination = new PaginatedCards();
    pagination.init(gameList, null);
}

function addEventListeners() {
    //execute a function when someone clicks in the document
    document.addEventListener("click", function (e) {closeAllLists(e.target);});
    
    const filterTabs = document.getElementsByClassName('tablinks');
    for (const tab of filterTabs) {
        const tabId = tab.id;
        const tabSubstring = tabId.substring(0, tabId.indexOf('_'));
        tab.addEventListener('click', () => {openFilterTab(tab, tabSubstring);});
    }

    const ratingRadioButtons = document.getElementsByName('choice-rating_filter');
    for (const button of ratingRadioButtons) {
        button.addEventListener('click', showRatingFilter);
    }

    document.getElementById('all_filter_apply').addEventListener('click', async () => {
        addGameCards(null, null);
    });
    document.getElementById('platform_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_platform_filters'), 'platform');});
    document.getElementById('franchise_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_franchise_filters'), 'franchise');});
    document.getElementById('company_filter_clear').addEventListener('click', ()=>{filterButtonClear(document.getElementById('applied_company_filters'), 'company');});
    document.getElementById('rating_filter_apply').addEventListener('click', ()=>{ratingFilterApply();});
    document.getElementById('rating_filter_clear').addEventListener('click', ()=>{ratingFilterClear();});
    document.getElementById('all_filter_clear').addEventListener('click',()=> {clearAllFilters();});
    
    document.getElementById('gameSearchButton').addEventListener('click', async () => {
        await gameSearch('allGames')
        .then((searchResults) => {addPaginatedCards(searchResults.gameList, searchResults.ratings);});
    });

    document.getElementById('gameSearchRemoveButton').addEventListener('click', async () => {await addGameCards(null, null);});

    document.getElementById('sort_title_ascend').addEventListener('click', async () => {
        await sortTitle(true);
        addPaginatedCards(null,  null);
    });
    document.getElementById('sort_title_descend').addEventListener('click', async () => {
        await sortTitle(false);
        addPaginatedCards(null, null);

    });
    document.getElementById('sort_popularity_ascend').addEventListener('click', async () => {
        await sortPopularity(true);
        addPaginatedCards(null, null);
    });
    document.getElementById('sort_popularity_descend').addEventListener('click', async () => {
        await sortPopularity(false);
        addPaginatedCards(null, null);
    });
    document.getElementById('sort_release_date_ascend').addEventListener('click', async () => {
        await sortReleaseDate(true);
        addPaginatedCards(null, null);
    });
    document.getElementById('sort_release_date_descend').addEventListener('click', async () => {
        await sortReleaseDate(false);
        addPaginatedCards(null, null);
    });
}

function PaginatedCards(gameList, user_ratings) {
  const prevButton = document.getElementById('button_prev');
  const nextButton = document.getElementById('button_next');

  let current_page = 1;
  let records_per_page = 5;

  this.init = function () {
    changePage(1);
    pageNumbers();
    selectedPage();
    addEventListeners();
  }

  let addEventListeners = function () {
    prevButton.addEventListener('click', prevPage);
    nextButton.addEventListener('click', nextPage);
  }

  let selectedPage = function () {
    let page_number = document.getElementById('page_number').getElementsByClassName('page-item');
    for (let i = 0; i < page_number.length; i++) {
      if (i == current_page - 1) {
        page_number[i].style.opacity = "1.0";
      }
      else {
        page_number[i].style.opacity = "0.5";
      }
    }
  }

  let checkButtonOpacity = function () {
    current_page == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
    current_page == numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
  }

  let changePage = function (page) {
    if (page < 1) {
      page = 1;
    }
    if (page > (numPages() - 1)) {
      page = numPages();
    }

    addGameCards(gameList, user_ratings);
    checkButtonOpacity();
    selectedPage();
  }

  let prevPage = function () {
    if (current_page > 1) {
      current_page--;
      changePage(current_page);
    }
  }

  let nextPage = function () {
    if (current_page < numPages()) {
      current_page++;
      changePage(current_page);
    }
  }

  let pageNumbers = function () {
    let pageNumber = document.getElementById('page_number');
    pageNumber.innerHTML = "";
    // `<li class="page-item"><a class="page-link clickPageNumber" href="#">${i}</a></li>`
    for (let i = 1; i < numPages() + 1; i++) {
      const pageLI = document.createElement('li');
      pageLI.classList.add("page-item");

      const pageLink = document.createElement('a');
      pageLink.classList.add("page-link");
      pageLink.innerHTML = i;
      pageLink.onclick = (e) => {
        current_page = e.target.textContent;
        changePage(current_page);
      }
      pageLI.appendChild(pageLink);
      pageNumber.appendChild(pageLI);
    }
  }

  let numPages = function () {
    return Math.ceil(gameList.length / records_per_page);
  }
  // Add game cards to main body container of the page
  let addGameCards = async function(gameList, user_ratings) {
    const gameCardsDiv = document.getElementById('gameCards');

    if (window.filters.length !== 0) {
      const filters = applySelectedFilters(window.filters);
      gameList = await fetchGameFilterList('/game/list/filter/all', filters);
    } else if (gameList === null) {
      gameList = await fetchGameList();
    }

    document.getElementById('title-search').value = '';
    gameCardsDiv.innerHTML = '';
    gameCardsDiv.classList.add('container-fluid');

    // render list of grid cards in flex-row with flex-wrap
    const flexCardContainer = document.createElement('div');
    flexCardContainer.classList.add('d-flex', 'flex-wrap');
    for (let i = (current_page - 1) * records_per_page; i < (current_page * records_per_page) && i < gameList.length; i++) {
      const game = gameList[i];

      const colContainer = document.createElement('div');
      colContainer.classList.add('col-4');
      // Create main card div per card
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.id = game.id;

      // Create div for game card image
      const pictureLink = document.createElement('a');
      const hrefLink = "game_overlay.html?gameID=" + game.id;
      pictureLink.href = hrefLink;
      const image = document.createElement('img');
      image.classList.add('card-img-top');
      if (game.cover !== null) {
        //image.src = 'https://' + game.cover;
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
      const title = document.createTextNode(game.name);
      cardTitle.appendChild(title);
      titleLink.appendChild(cardTitle);
      cardBodyDiv.appendChild(titleLink);

      // Add description to game card body
      const gameDescription = document.createElement('p');
      gameDescription.classList.add('card-text');
      const descriptionText = game.description;
      let truncatedText;
      if (descriptionText !== null) {
        if (descriptionText.split(' ').length > 100) {
          truncatedText = descriptionText.split(" ").splice(0, 100).join(" ");
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

      // Create div to put rating and wishlist buttons at bottom of card
      const bottomCard = document.createElement('div');
      bottomCard.classList.add('bottomGameCard', 'mb-1');

      // Create ratings div and insert rating label
      const ratingsDiv = document.createElement('div');
      ratingsDiv.classList.add('d-flex', 'flex-row', 'flex-wrap');
      const ratingLabel = document.createElement('p');
      ratingLabel.classList.add('mr-3');
      const textRatingLabel = document.createTextNode('Your Rating: ');
      ratingLabel.appendChild(textRatingLabel);
      ratingsDiv.appendChild(ratingLabel);

      let goldStarNum = 0;
      const ratingObj = {
          rating: 5
      };
      if (ratingObj) {
        goldStarNum = ratingObj.rating;
      }
      // Create card game rating stars
      for (let starCount = 1; starCount <= 5; starCount++) {
        const starDiv = document.createElement('div');
        starDiv.classList.add('fa', 'fa-star', 'mt-1', 'mb-2');
        if (goldStarNum > 0) {
          starDiv.style.color = 'gold';
          goldStarNum--;
        }
        starDiv.addEventListener('click', () => { clickStar(starDiv, ratingsDiv, starCount); });
        ratingsDiv.appendChild(starDiv);
      }

      // Create card game rating submit button and add ratings div to card body div
      const submitButton = document.createElement('button');
      submitButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'ml-2', 'h-25', 'mt-n1');
      submitButton.innerText = 'Submit';
      submitButton.addEventListener('click', () => { ratingSubmit(ratingsDiv, cardDiv.id); });
      ratingsDiv.appendChild(submitButton);
      bottomCard.appendChild(ratingsDiv);

      // Create add to wishlist button
      const wishlistDiv = document.createElement('div');
      wishlistDiv.classList.add('text-center', 'h-25');
      const wishlistButton = document.createElement('button');
      wishlistButton.classList.add('btn', 'btn-sm', 'btn-success');
      wishlistButton.innerText = 'Add to Wishlist';
      wishlistButton.addEventListener('click', () => { wishlistAdd(cardDiv.id); });
      wishlistDiv.appendChild(wishlistButton);
      bottomCard.appendChild(wishlistDiv);

      cardBodyDiv.appendChild(bottomCard);

      // Add single card div to grid wrapper & to flex-row container
      cardDiv.appendChild(cardBodyDiv);
      colContainer.appendChild(cardDiv);
      flexCardContainer.appendChild(colContainer);
    }
    gameCardsDiv.appendChild(flexCardContainer)
  }
}

