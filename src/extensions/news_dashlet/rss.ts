import FeedParser from 'feedparser';
import { IncomingMessage } from 'http';
import { get } from 'https';
import * as url from 'url';

function retrieve(rssUrl: string): Promise<FeedParser.Item[]> {
  return new Promise<FeedParser.Item[]>((resolve, reject) => {
    get({
      ...url.parse(rssUrl),
      headers: { 'User-Agent': 'Vortex', Cookie: 'rd=true' },

    } as any, (res: IncomingMessage) => {
      const { statusCode } = res;

      let err: string;
      if (statusCode !== 200) {
        err = `Request Failed. Status Code: ${statusCode}`;
      }

      const parser = new FeedParser({});

      const result: FeedParser.Item[] = [];

      parser.on('error', error => {
        res.destroy();
        reject(error);
      });
      parser.on('readable', () => {
        while (true) {
          const item = parser.read();
          if (item === null) {
            break;
          } else {
            result.push(item);
          }
        }
      });
      parser.on('end', () => {
        resolve(result);
      });

      if (err !== undefined) {
        res.resume();
        return reject(new Error(err));
      }

      res.pipe(parser);
    })
      .on('error', (err: Error) => {
        return reject(err);
      });
  });
}

export default retrieve;
