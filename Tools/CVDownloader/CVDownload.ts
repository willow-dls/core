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
    throw new Error(`HTTP error! status: ${response.status}`);
}

return await response.json() as tokenData;
}

async function getUserProjects(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as any;
    }

