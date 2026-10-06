export const MOVIES=[
{id:'dune2',title:'Dune: Part Two',year:2024,genre:'Sci-Fi',runtime:'2h 46m',cert:'PG-13',match:96,avg:4.4,overview:'Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family.'},
{id:'arrival',title:'Arrival',year:2016,genre:'Sci-Fi',runtime:'1h 56m',cert:'PG-13',match:94,avg:4.3,overview:'A linguist is recruited to communicate with visitors whose ships hover over twelve cities.'},
{id:'pastlives',title:'Past Lives',year:2023,genre:'Drama',runtime:'1h 46m',cert:'PG-13',match:91,avg:4.2,overview:'Two childhood friends reconnect across decades and continents.'},
{id:'bladerunner',title:'Blade Runner 2049',year:2017,genre:'Sci-Fi',runtime:'2h 44m',cert:'R',match:93,avg:4.2,overview:'A young blade runner uncovers a secret that could plunge what is left of society into chaos.'},
{id:'parasite',title:'Parasite',year:2019,genre:'Thriller',runtime:'2h 12m',cert:'R',match:89,avg:4.5,overview:'A struggling family schemes its way into the household of a wealthy one.'},
{id:'exmachina',title:'Ex Machina',year:2014,genre:'Sci-Fi',runtime:'1h 48m',cert:'R',match:90,avg:4.0,overview:'A programmer is invited to evaluate the human qualities of a humanoid AI.'},
{id:'her',title:'Her',year:2013,genre:'Romance',runtime:'2h 6m',cert:'R',match:87,avg:4.0,overview:'A lonely writer develops an unlikely relationship with an operating system.'},
{id:'sicario',title:'Sicario',year:2015,genre:'Thriller',runtime:'2h 1m',cert:'R',match:85,avg:3.9,overview:'An FBI agent is enlisted into an escalating war on the US–Mexico border.'},
{id:'annihilation',title:'Annihilation',year:2018,genre:'Sci-Fi',runtime:'1h 55m',cert:'R',match:88,avg:3.7,overview:'A biologist joins an expedition into an environmental disaster zone where the laws of nature do not apply.'},
{id:'everything',title:'Everything Everywhere All at Once',year:2022,genre:'Comedy',runtime:'2h 19m',cert:'R',match:84,avg:4.1,overview:'A laundromat owner discovers she must connect with parallel-universe versions of herself.'},
{id:'interstellar',title:'Interstellar',year:2014,genre:'Sci-Fi',runtime:'2h 49m',cert:'PG-13',match:92,avg:4.3,overview:'Explorers travel through a wormhole in search of a new home for humanity.'},
{id:'aftersun',title:'Aftersun',year:2022,genre:'Drama',runtime:'1h 42m',cert:'R',match:86,avg:4.0,overview:'A woman reflects on a holiday she took with her father twenty years earlier.'},
{id:'prisoners',title:'Prisoners',year:2013,genre:'Thriller',runtime:'2h 33m',cert:'R',match:83,avg:4.1,overview:'A father takes matters into his own hands after his daughter goes missing.'},
{id:'moonlight',title:'Moonlight',year:2016,genre:'Drama',runtime:'1h 51m',cert:'R',match:82,avg:4.0,overview:'Three chapters in the life of a young man growing up in Miami.'},
{id:'grandbudapest',title:'The Grand Budapest Hotel',year:2014,genre:'Comedy',runtime:'1h 39m',cert:'R',match:80,avg:4.1,overview:'A concierge and his lobby boy become entangled in the theft of a priceless painting.'},
{id:'whiplash',title:'Whiplash',year:2014,genre:'Drama',runtime:'1h 46m',cert:'R',match:88,avg:4.4,overview:'A young drummer enrolls at a cut-throat conservatory under a ruthless instructor.'}
];
export const BY_ID=Object.fromEntries(MOVIES.map(m=>[m.id,m]));
