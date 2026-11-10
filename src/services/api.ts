const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function login(email:string,password:string){
  const response=await fetch(`${API_URL}/login`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      email,
      password
    })
  });

  const data=await response.json();

  if(!response.ok){
    throw new Error(data.error||'Login failed');
  }

  return data;
}

export async function register(
  firstName:string,
  lastName:string,
  email:string,
  password:string,
  role:'player'|'coach'
){
  const response=await fetch(`${API_URL}/register`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      role
    })
  });

  const data=await response.json();

  if(!response.ok){
    throw new Error(data.error||'Registration failed');
  }

  return data;
}

export async function getProfile(token:string){
  const response=await fetch(`${API_URL}/profile`,{
    method:'GET',
    headers:{
      Authorization:`Bearer ${token}`
    }
  });

  const data=await response.json();

  if(!response.ok){
    throw new Error(data.error||'Could not load profile');
  }

  return data.profile;
}