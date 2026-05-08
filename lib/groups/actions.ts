import { supabase } from "../supabase/client";

/**
 * Fetches all groups the user is currently a member of.
 * Uses a join to get group details like name and streak.
 */
export async function getUserGroups(userId: string) {
  const { data, error } = await supabase
    .from("group_members")
    .select(`
      group_id,
      groups (
        id,
        name,
        group_streak
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching groups:", error.message);
    return [];
  }
  
  // Return a clean list of group objects
  return data.map((item: any) => item.groups);
}

/**
 * Creates a new group and automatically joins the creator to it.
 */
export async function createGroup(groupName: string, userId: string) {
  // 1. Insert the new group
  const { data: group, error: groupError } = await supabase
  .from("groups")
  .insert({ 
    name: groupName, 
    group_streak: 0,
    created_at: new Date().toISOString() // Manually sending the time
  })
  .select()
  .single();
  if (groupError) throw groupError;

  // 2. Add the creator as the first member
  const { error: memberError } = await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: userId });

  if (memberError) throw memberError;

  return group;
}

/**
 * Joins an existing group using its UUID.
 */
export async function joinGroup(groupId: string, userId: string) {
  const { error } = await supabase
    .from("group_members")
    .insert({ group_id: groupId, user_id: userId });

  if (error) {
    if (error.code === '23505') {
      throw new Error("You are already a member of this group.");
    }
    throw new Error("Invalid Group ID. Please check and try again.");
  }
  
  return { success: true };
}

/**
 * Removes a user from a specific group.
 */
export async function leaveGroup(groupId: string, userId: string) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .match({ group_id: groupId, user_id: userId });

  if (error) throw error;
  
  return { success: true };
}

/**
 * Fetches the "Pulse" of a group: all members and their status for today.
 */
export async function getGroupPulse(groupId: string) {
  const { data: members, error: memberError } = await supabase
    .from("group_members")
    .select(`
      user_id,
      profiles (
        username, 
        overall_study_minutes
      )
    `)
    .eq("group_id", groupId);

  if (memberError) throw memberError;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pulseData = await Promise.all(members.map(async (m: any) => {
    const { data: sessions } = await supabase
      .from("study_sessions")
      .select("id")
      .eq("user_id", m.user_id)
      .gte("created_at", today.toISOString())
      .gte("duration_minutes", 30);

    // THE SAFETY NET:
    // If profiles is null, we provide a default object so the UI doesn't break
    const profile = m.profiles || { 
      username: "Active Scholar", 
      overall_study_minutes: 0 
    };

    return {
      id: m.user_id,
      name: profile.username || "Active Scholar", 
      hasFinishedToday: (sessions?.length || 0) > 0,
      totalMinutes: profile.overall_study_minutes || 0
    };
  }));

  return pulseData;
}

