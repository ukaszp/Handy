export interface User {
      id: number;
      name: string;
      lastName: string;
      email: string;
      passwordHash: string;
      contactNumber?: string;
      gender?: string;
      whenJoined: string;
      dateOfBirth?: string;
      roleId: number;
      role: {
        id: number;
        name: string;
        description: string;
      };
      Avatar?: string;
  }
  