import * as readline from 'readline'
import { stdin as input, stdout as output } from 'process';
import * as fs from 'fs'

interface UserData {
    email: string;
    password: string;
}

interface tokenData {
    token: string;
}

async function loginUser(url: string, data: UserData): Promise<tokenData> {
const response = await fetch(url, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});

if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} \nDetails: ${response.statusText}`);
}

return await response.json() as tokenData;
}

async function getUserProjects(url: string, user: tokenData): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.stringify(user)
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as any;
    }

function getInputHidden(prompt: string): string {
    const rl = readline.createInterface({
        input, 
        output, 
        terminal:true
    });
    output.write(prompt)
    const inputString: string[] = [];

    rl.input.on('keypress', (str, key) => {
        if (key.name === 'return') {
            rl.close()
        }
        else if (key.name === 'backspace') {
            if (inputString.length > 0){
                inputString.pop()
                output.write('\b \b')
            }
        }
        else{
            inputString.push(str)
            output.write('*')
        }
    })
    let result: string = ''
    rl.on('close', () => {
        output.write('n')
        result = inputString.join('')
    })
    return result;
}

function main() {
    console.log("Authentication required for retrieving projects from CircuitVerse.\n")
    const login: UserData = {
        email: '',
        password: ''
    }
    login.email = getInputHidden("Please enter your CircuitVerse login email: ")
    login.password = getInputHidden("Please enter your CircuitVerse login password: ")

    let token: tokenData = {token: ''}
    loginUser('104.26.5.230/api/v1/auth/login', login).then(x => {token = x})

    console.log("Retrieving projects from user.")

    let data
    getUserProjects('104.26.5.230/api/vs/projects', token).then(x => {data = x} )

    fs.writeFile("test.cv", data, (err) => {
        if (err) {
            console.error('Error writing file: ', err);
        }
        else{
            console.log('Project File saved');
        }
    })


}

main();