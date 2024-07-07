export const getUserId = async (useCache = true): Promise<string> => {
  try {
    let user: any =
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") as string);

    if (!user || !useCache) {
      let req = await fetch("/auth/creds");
      req = await req.json();
      user = (req as any).user;

      if (!user) return null as unknown as string;

      localStorage.setItem("user", JSON.stringify(user));
    }

    return user.id;
  } catch (e) {
    if (useCache) {
      localStorage.removeItem("user");
      return getUserId(true);
    } else {
      throw e;
    }
  }
};

export const userSignedIn = async (): Promise<boolean> => {
  try {
    let user: any =
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") as string);

    if (!user) {
      let req = await fetch("/auth/creds");
      req = await req.json();
      user = (req as any).user;

      if (!user) return false;
      localStorage.setItem("user", JSON.stringify(user));
    }

    return true;
  } catch (e) {
    return false;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await fetch("/auth/logout");
    localStorage.removeItem("user");
  } catch (e) {
    console.error(e);
  }
};

export const clearUserCache = (): void => {
  localStorage.removeItem("user");
};

// /auth/username returns {"username": "username"}
// localStorage.set('username', 'username')
export const getUsername = async (useCache = true): Promise<string> => {
  try {
    let username: string = localStorage.getItem("username") as string;

    if (!username || !useCache) {
      let req = await fetch("/auth/username");
      req = await req.json();
      username = (req as any).username;

      if (!username) return null as unknown as string;

      localStorage.setItem("username", username);
    }

    return username;
  } catch (e) {
    if (useCache) {
      localStorage.removeItem("username");
      return getUsername(true);
    } else {
      throw e;
    }
  }
};

export const clearAuthCache = (): void => {
  localStorage.removeItem("username");
  localStorage.removeItem("user");
};
