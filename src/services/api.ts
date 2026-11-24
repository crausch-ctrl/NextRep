const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function readJson(response:Response){
  const data=await response.json();

  if(!response.ok){
    throw new Error(
      data.error||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function login(
  email:string,
  password:string
){
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

  return readJson(response);
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

  return readJson(response);
}

export async function getProfile(token:string){
  const response=await fetch(`${API_URL}/profile`,{
    method:'GET',
    headers:{
      Authorization:`Bearer ${token}`
    }
  });

  const data=await readJson(response);
  return data.profile;
}

export async function createTeam(
  token:string,
  name:string,
  sport:string
){
  const response=await fetch(`${API_URL}/teams`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({
      name,
      sport
    })
  });

  const data=await readJson(response);
  return data.team;
}

export async function getMyTeams(token:string){
  const response=await fetch(`${API_URL}/teams/mine`,{
    method:'GET',
    headers:{
      Authorization:`Bearer ${token}`
    }
  });

  const data=await readJson(response);
  return data.teams;
}

export async function inviteToTeam(
  token:string,
  teamId:number,
  email:string
){
  const response=await fetch(
    `${API_URL}/teams/${teamId}/invitations`,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        email
      })
    }
  );

  const data=await readJson(response);
  return data.invitation;
}

export async function getMyInvitations(token:string){
  const response=await fetch(
    `${API_URL}/invitations/mine`,
    {
      method:'GET',
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data=await readJson(response);
  return data.invitations;
}

export async function acceptTeamInvitation(
  token:string,
  inviteId:number
){
  const response=await fetch(
    `${API_URL}/invitations/${inviteId}/accept`,
    {
      method:'POST',
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data=await readJson(response);
  return data.result;
}

export async function getTeamMembers(
  token:string,
  teamId:number
){
  const response=await fetch(
    `${API_URL}/teams/${teamId}/members`,
    {
      method:'GET',
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data=await readJson(response);
  return data.members;
}
export async function getMyPerformanceResults(
  token:string
){
  const response=await fetch(
    `${API_URL}/performance-results/mine`,
    {
      method:'GET',
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data=await readJson(response);

  return data.results;
}


export async function logPerformanceResult(
  token:string,
  metric:string,
  value:number
){
  const response=await fetch(
    `${API_URL}/performance-results`,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        metric,
        value
      })
    }
  );

  const data=await readJson(response);

  return data.result;
}


export async function getMyGoals(
  token:string
){
  const response=await fetch(
    `${API_URL}/goals/mine`,
    {
      method:'GET',
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data=await readJson(response);

  return data.goals;
}


export async function saveMyGoal(
  token:string,
  metric:string,
  targetValue:number
){
  const response=await fetch(
    `${API_URL}/goals`,
    {
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        metric,
        targetValue
      })
    }
  );

  const data=await readJson(response);

  return data.goal;
}