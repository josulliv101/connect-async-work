import axios, { CancelToken } from 'axios'

export default function SimpleApi(url) {
  const source = CancelToken.source()
  const request = axios.get(url, { 
    cancelToken: source.token, 
  })
  request['CANCEL'] = () => source.cancel('Request cancelled by unmounting react component.')
  return request.then((resp) => resp.data).catch((err) => err)
}