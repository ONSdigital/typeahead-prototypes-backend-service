import { Express } from 'express';
import * as Fuse from 'fuse.js';
import  { FuseOptions } from 'fuse.js';

interface ICodeListItem {
  code: number;
  'en-gb': string;
  'cy': string;
}

const codeLists = {
  language: <ICodeListItem[]>require('./code-lists/languages.json'),
  'national-identity': <ICodeListItem[]>require('./code-lists/national-identity.json'),
  'country-of-birth': <ICodeListItem[]>require('./code-lists/country-of-birth.json'),
  passport:<ICodeListItem[]> require('./code-lists/passport.json'),
  religion: <ICodeListItem[]>require('./code-lists/religion.json'),
  'ethnic-groups-white': <ICodeListItem[]>require('./code-lists/ethnic-groups-white.json'),
  'ethnic-groups-mixed': <ICodeListItem[]>require('./code-lists/ethnic-groups-mixed.json'),
  'ethnic-groups-asian': <ICodeListItem[]>require('./code-lists/ethnic-groups-asian.json'),
  'ethnic-groups-black': <ICodeListItem[]>require('./code-lists/ethnic-groups-black.json'),
  'ethnic-groups-arab': <ICodeListItem[]>require('./code-lists/ethnic-groups-arab.json'),
  'ethnic-groups-other': <ICodeListItem[]>[
    ...require('./code-lists/ethnic-groups-white.json'),
    ...require('./code-lists/ethnic-groups-mixed.json'),
    ...require('./code-lists/ethnic-groups-asian.json'), 
    ...require('./code-lists/ethnic-groups-black.json'),
    ...require('./code-lists/ethnic-groups-arab.json')
  ],
  occupation: <ICodeListItem[]>require('./code-lists/occupations.json'),
  'sic-alphabetical': <ICodeListItem[]>require('./code-lists/sic-alphabetical.json'),
};

const allowedOrigins = [
  'http://localhost',
  'sdc-prototypes.netlify.com',
  'eq-prototypes.netlify.com'
];

export default function initialiseSearch(server: Express): void {
  for (const listName in codeLists) {
    if (codeLists.hasOwnProperty(listName)) {
      const list: ICodeListItem[] = (<any>codeLists)[listName];

      server.post(`/${listName}`, (request, response) => {
        const origin = <string>request.headers.origin;

        if (originIsAllowed(origin)) {
          const query = (request.body.query || '').trim().toLowerCase();
          const language = request.body.lang;
          const maxResults = request.body.max ? parseInt(request.body.max, 10) : 10;
          const languages: string[] = [];

          if (language) {
            languages.push(language.trim().toLowerCase());
          }

          if (!languages.includes('en-gb')) {
            languages.push('en-gb');
          }

          const fuse = new Fuse(list,  <FuseOptions<any>>{
            shouldSort: true,
            caseSensitive: false,
            keys: languages,
            threshold: 0.2
          });
          
          const results = fuse.search(query);

          const responseData = {
            results: results.slice(0, maxResults),
            totalResults: results.length
          };

          response.setHeader('Access-Control-Allow-Origin', origin);

          response.send(responseData);
        } else {
          response.status(401);
          response.send();
        }
      });
    }
  }
}

function originIsAllowed(origin: string) {
  return !!allowedOrigins.find(o => origin.includes(o));
}
