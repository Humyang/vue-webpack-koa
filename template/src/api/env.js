

;
let setip=''
let Host1 = ''
export const ServerPort = {{ ServerPort }}
export const StaticPort = {{ StaticPort }}
// export const OAUTH_PORT = 8000


if (process.env.NODE_ENV === 'production') {

 setip = 'http://{{ api_domain}}'
 Host1 = 'http://{{ domain }}'

}else{

 setip = 'http://localhost:'+ ServerPort
 Host1 = 'http://localhost:' + StaticPort
}

export const IP = setip
export const Host = Host1