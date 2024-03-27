import axios from 'axios';
import fetchAdapter from '../index';

describe('fetchAdapter', () => {
  it('should handle post request', async () => {
    let response = await axios.request({
      url: 'https://httpbin.org/post',
      method: 'post',
      data: { hello: 'world' },
      adapter: fetchAdapter,
    });

    // expect(JSON.parse(response.data.data)).toStrictEqual({ hello: "world" });
  });
});
