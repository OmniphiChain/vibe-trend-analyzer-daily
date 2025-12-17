import { UserLimits, PrivateRoom } from "@/types/rooms";

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  currentUsage?: number;
  limit?: number;
}

export interface UserUsageStats {
  roomsCreated: number;
  roomsJoined: number;
  invitesSentToday: number;
  lastInviteReset: Date;
}

// Mock user usage tracking - in real app this would come from backend
const mockUserUsage: Record<string, UserUsageStats> = {
  "user-1": {
    roomsCreated: 1,
    roomsJoined: 3,
    invitesSentToday: 2,
    lastInviteReset: new Date(),
  },
};

export const getUserUsageStats = (userId: string): UserUsageStats => {
  const today = new Date();
  const userStats = mockUserUsage[userId] || {
    roomsCreated: 0,
    roomsJoined: 0,
    invitesSentToday: 0,
    lastInviteReset: today,
  };

  // Reset daily invite count if it's a new day
  const lastReset = new Date(userStats.lastInviteReset);
  if (today.toDateString() !== lastReset.toDateString()) {
    userStats.invitesSentToday = 0;
    userStats.lastInviteReset = today;
    mockUserUsage[userId] = userStats;
  }

  return userStats;
};

export const canCreateRoom = (
  userId: string,
  userLimits: UserLimits,
  existingRooms: PrivateRoom[],
): LimitCheckResult => {
  const usage = getUserUsageStats(userId);
  const userRooms = existingRooms.filter((room) => room.createdBy === userId);

  if (userRooms.length >= userLimits.maxPrivateRooms) {
    return {
      allowed: false,
      reason: `You've reached your limit of ${userLimits.maxPrivateRooms} private rooms`,
      upgradeRequired: userLimits.maxPrivateRooms === 1,
      currentUsage: userRooms.length,
      limit: userLimits.maxPrivateRooms,
    };
  }

  return {
    allowed: true,
    currentUsage: userRooms.length,
    limit: userLimits.maxPrivateRooms,
  };
};

export const canJoinRoom = (
  userId: string,
  userLimits: UserLimits,
  existingRooms: PrivateRoom[],
): LimitCheckResult => {
  const usage = getUserUsageStats(userId);
  const joinedRooms = existingRooms.filter((room) =>
    room.members.some((member) => member.userId === userId),
  );

  if (joinedRooms.length >= userLimits.maxJoinedRooms) {
    return {
      allowed: false,
      reason: `You've reached your limit of ${userLimits.maxJoinedRooms} joined rooms`,
      upgradeRequired: userLimits.maxJoinedRooms === 5,
      currentUsage: joinedRooms.length,
      limit: userLimits.maxJoinedRooms,
    };
  }

  return {
    allowed: true,
    currentUsage: joinedRooms.length,
    limit: userLimits.maxJoinedRooms,
  };
};

export const canInviteMembers = (
  userId: string,
  userLimits: UserLimits,
  inviteCount: number = 1,
): LimitCheckResult => {
  const usage = getUserUsageStats(userId);

  if (usage.invitesSentToday + inviteCount > userLimits.maxInvitesPerHour) {
    const remaining = userLimits.maxInvitesPerHour - usage.invitesSentToday;
    return {
      allowed: false,
      reason: `Daily invite limit reached. You can send ${remaining} more invite${remaining !== 1 ? "s" : ""} today`,
      upgradeRequired: userLimits.maxInvitesPerHour === 5,
      currentUsage: usage.invitesSentToday,
      limit: userLimits.maxInvitesPerHour,
    };
  }

  return {
    allowed: true,
    currentUsage: usage.invitesSentToday,
    limit: userLimits.maxInvitesPerHour,
  };
};

export const canAddMembersToRoom = (
  room: PrivateRoom,
  userLimits: UserLimits,
  newMemberCount: number = 1,
): LimitCheckResult => {
  const currentMemberCount = room.members.length;
  const totalAfterAdding = currentMemberCount + newMemberCount;

  if (totalAfterAdding > userLimits.maxRoomMembers) {
    return {
      allowed: false,
      reason: `Room member limit reached. Maximum ${userLimits.maxRoomMembers} members allowed`,
      upgradeRequired: userLimits.maxRoomMembers === 10,
      currentUsage: currentMemberCount,
      limit: userLimits.maxRoomMembers,
    };
  }

  return {
    allowed: true,
    currentUsage: currentMemberCount,
    limit: userLimits.maxRoomMembers,
  };
};

export const canCreatePolls = (
  userId: string,
  userLimits: UserLimits,
): LimitCheckResult => {
  if (!userLimits.canCreatePolls) {
    return {
      allowed: false,
      reason: "Creating polls requires premium membership",
      upgradeRequired: true,
    };
  }

  return { allowed: true };
};

export const updateUserUsage = (
  userId: string,
  action: "create_room" | "join_room" | "send_invite",
): void => {
  const usage = getUserUsageStats(userId);

  switch (action) {
    case "create_room":
      usage.roomsCreated += 1;
      break;
    case "join_room":
      usage.roomsJoined += 1;
      break;
    case "send_invite":
      usage.invitesSentToday += 1;
      break;
  }

  mockUserUsage[userId] = usage;
};

export const getUserLimitInfo = (
  userId: string,
  userLimits: UserLimits,
  existingRooms: PrivateRoom[],
) => {
  const usage = getUserUsageStats(userId);
  const userRooms = existingRooms.filter((room) => room.createdBy === userId);
  const joinedRooms = existingRooms.filter((room) =>
    room.members.some((member) => member.userId === userId),
  );

  return {
    rooms: {
      created: userRooms.length,
      maxCreated: userLimits.maxPrivateRooms,
      joined: joinedRooms.length,
      maxJoined: userLimits.maxJoinedRooms,
    },
    invites: {
      sentToday: usage.invitesSentToday,
      maxPerDay: userLimits.maxInvitesPerHour,
      remaining: userLimits.maxInvitesPerHour - usage.invitesSentToday,
    },
    features: {
      canCreatePolls: userLimits.canCreatePolls,
      maxRoomMembers: userLimits.maxRoomMembers,
    },
  };
};

export const getUpgradeMessage = (limitType: string): string => {
  const messages = {
    rooms:
      "Upgrade to Premium to create up to 20 private rooms and join 50 rooms!",
    invites: "Upgrade to Premium to send up to 25 invites per day!",
    members: "Upgrade to Premium to have up to 50 members per room!",

    polls: "Upgrade to Premium to create polls and engage the community!",
  };

  return (
    messages[limitType as keyof typeof messages] ||
    "Upgrade to Premium for more features!"
  );
};
