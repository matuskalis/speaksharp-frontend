"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import {
  Users,
  Search,
  UserPlus,
  Copy,
  Check,
  Trophy,
  Zap,
  Flame,
  BookOpen,
  Target,
  Clock,
  ChevronRight,
  X,
  Share2,
  Swords,
} from "lucide-react";

interface Friend {
  user_id: string;
  username: string | null;
  display_name: string | null;
  level: number;
  total_xp: number;
  streak_days: number;
  xp_today: number;
  lessons_today: number;
  friend_since: string;
}

interface PendingRequest {
  request_id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  level: number;
  total_xp: number;
  requested_at: string;
}

interface SearchResult {
  user_id: string;
  username: string | null;
  display_name: string | null;
  friend_code: string | null;
  level: number;
  total_xp: number;
  streak_days: number;
  is_friend: boolean;
  friendship_status: string | null;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [friendCode, setFriendCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getFriends();
      setFriends(data.friends);
      setPendingRequests(data.pending_requests);
      setFriendCode(data.friend_code);
    } catch (error) {
      console.error("Failed to load friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const data = await apiClient.searchUsers(searchQuery);
      setSearchResults(data.users);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setSearching(false);
    }
  };

  const sendRequest = async (userId: string) => {
    try {
      const result = await apiClient.sendFriendRequest(userId);
      if (result.success) {
        // Update search results
        setSearchResults((prev) =>
          prev.map((u) =>
            u.user_id === userId
              ? { ...u, friendship_status: result.status }
              : u
          )
        );
        if (result.status === "accepted") {
          loadFriends();
        }
      }
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };

  const acceptRequest = async (requesterId: string) => {
    try {
      await apiClient.acceptFriendRequest(requesterId);
      loadFriends();
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const declineRequest = async (requesterId: string) => {
    try {
      await apiClient.declineFriendRequest(requesterId);
      setPendingRequests((prev) =>
        prev.filter((r) => r.user_id !== requesterId)
      );
    } catch (error) {
      console.error("Failed to decline request:", error);
    }
  };

  const copyFriendCode = async () => {
    await navigator.clipboard.writeText(friendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const createAndCopyInviteLink = async () => {
    try {
      const data = await apiClient.createInviteLink();
      setInviteLink(data.invite_url);
      await navigator.clipboard.writeText(data.invite_url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (error) {
      console.error("Failed to create invite link:", error);
    }
  };

  const getName = (user: { display_name: string | null; username: string | null }) => {
    return user.display_name || user.username || "Anonymous";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 p-6">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-10 bg-dark-200 rounded-lg w-1/3" />
          <div className="h-32 bg-dark-200 rounded-2xl" />
          <div className="h-64 bg-dark-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Friends</h1>
              <p className="text-sm text-text-muted">{friends.length} friends</p>
            </div>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="px-4 py-2 bg-gradient-brand text-white rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <UserPlus className="w-5 h-5" />
            Add Friend
          </button>
        </div>

        {/* Search Panel */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass gradient-border rounded-2xl p-5 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">Find Friends</h3>
                <button onClick={() => setShowSearch(false)}>
                  <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
                </button>
              </div>

              {/* Search Input */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                    placeholder="Search by username or friend code"
                    className="w-full pl-10 pr-4 py-3 bg-dark-200 border border-white/[0.06] rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple/50"
                  />
                </div>
                <button
                  onClick={searchUsers}
                  disabled={searching}
                  className="px-6 py-3 bg-accent-purple text-white rounded-xl font-medium hover:bg-accent-purple/90 transition-colors disabled:opacity-50"
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-3 bg-dark-200/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center">
                          <span className="text-lg font-bold text-text-primary">
                            {getName(user)[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{getName(user)}</p>
                          <div className="flex items-center gap-3 text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" /> Level {user.level}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {user.streak_days} day streak
                            </span>
                          </div>
                        </div>
                      </div>
                      {user.is_friend ? (
                        <span className="text-sm text-green-400">Friends</span>
                      ) : user.friendship_status === "pending" ? (
                        <span className="text-sm text-yellow-400">Pending</span>
                      ) : (
                        <button
                          onClick={() => sendRequest(user.user_id)}
                          className="px-3 py-1.5 bg-accent-purple/20 text-accent-purple rounded-lg text-sm font-medium hover:bg-accent-purple/30"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Share Options */}
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-sm text-text-muted mb-3">Or share your friend code:</p>
                <div className="flex gap-3">
                  <button
                    onClick={copyFriendCode}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-dark-200 rounded-xl text-text-primary hover:bg-dark-300 transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="font-mono">{friendCode}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={createAndCopyInviteLink}
                    className="flex items-center gap-2 px-4 py-3 bg-accent-purple/20 text-accent-purple rounded-xl hover:bg-accent-purple/30 transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-5 h-5" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5" />
                        Share Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass gradient-border rounded-2xl p-5"
          >
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent-purple" />
              Friend Requests
              <span className="ml-auto bg-accent-purple/20 text-accent-purple text-xs px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            </h3>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.request_id}
                  className="flex items-center justify-between p-3 bg-dark-200/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-text-primary">
                        {getName(request)[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{getName(request)}</p>
                      <p className="text-xs text-text-muted">Level {request.level}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest(request.user_id)}
                      className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(request.user_id)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Friends List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass gradient-border rounded-2xl p-5"
        >
          <h3 className="font-semibold text-text-primary mb-4">Your Friends</h3>

          {friends.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-text-muted">No friends yet</p>
              <p className="text-sm text-text-muted mt-1">
                Search for friends or share your code to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend, index) => (
                <motion.div
                  key={friend.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center justify-between p-4 bg-dark-200/50 rounded-xl hover:bg-dark-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar with rank badge */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center">
                        <span className="text-xl font-bold text-text-primary">
                          {getName(friend)[0].toUpperCase()}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          'bg-orange-400 text-orange-900'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-semibold text-text-primary">{getName(friend)}</p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-yellow-400" />
                          Level {friend.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-400" />
                          {friend.streak_days} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Today's Stats */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-text-primary font-medium">{friend.xp_today}</span>
                        <span className="text-text-muted">XP today</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <BookOpen className="w-3 h-3" />
                        {friend.lessons_today} lessons
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Friend Challenges Section */}
        <FriendChallengesSection friends={friends} />
      </div>
    </div>
  );
}

function FriendChallengesSection({ friends }: { friends: Friend[] }) {
  const [challenges, setChallenges] = useState<{
    sent: any[];
    received: any[];
  }>({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [challengeType, setChallengeType] = useState<"beat_xp_today" | "more_lessons_today">("beat_xp_today");

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getFriendChallenges();
      setChallenges(data);
    } catch (error) {
      console.error("Failed to load challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async () => {
    if (!selectedFriend) return;
    try {
      await apiClient.createFriendChallenge(selectedFriend, challengeType);
      setShowCreate(false);
      loadChallenges();
    } catch (error) {
      console.error("Failed to create challenge:", error);
    }
  };

  const respondToChallenge = async (challengeId: string, accept: boolean) => {
    try {
      await apiClient.respondToChallenge(challengeId, accept);
      loadChallenges();
    } catch (error) {
      console.error("Failed to respond to challenge:", error);
    }
  };

  const getName = (user: { challenged_display_name?: string | null; challenged_username?: string | null; challenger_display_name?: string | null; challenger_username?: string | null }) => {
    return user.challenged_display_name || user.challenged_username ||
           user.challenger_display_name || user.challenger_username || "Anonymous";
  };

  const getChallengeLabel = (type: string) => {
    return type === "beat_xp_today" ? "XP Challenge" : "Lessons Challenge";
  };

  if (loading) return null;

  const activeChallenges = [...challenges.sent, ...challenges.received].filter(
    (c) => c.status === "accepted" && c.challenge_date === new Date().toISOString().split("T")[0]
  );

  const pendingChallenges = challenges.received.filter((c) => c.status === "pending");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass gradient-border rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary flex items-center gap-2">
          <Swords className="w-5 h-5 text-accent-purple" />
          Friend Challenges
        </h3>
        {friends.length > 0 && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-sm text-accent-purple hover:text-accent-purple/80"
          >
            + New Challenge
          </button>
        )}
      </div>

      {/* Create Challenge Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-dark-200/50 rounded-xl"
          >
            <div className="space-y-3">
              <select
                value={selectedFriend}
                onChange={(e) => setSelectedFriend(e.target.value)}
                className="w-full p-3 bg-dark-300 border border-white/[0.06] rounded-lg text-text-primary"
              >
                <option value="">Select a friend</option>
                {friends.map((f) => (
                  <option key={f.user_id} value={f.user_id}>
                    {f.display_name || f.username || "Anonymous"}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setChallengeType("beat_xp_today")}
                  className={`flex-1 p-3 rounded-lg text-sm font-medium ${
                    challengeType === "beat_xp_today"
                      ? "bg-accent-purple text-white"
                      : "bg-dark-300 text-text-muted"
                  }`}
                >
                  <Zap className="w-4 h-4 inline mr-1" />
                  Beat My XP
                </button>
                <button
                  onClick={() => setChallengeType("more_lessons_today")}
                  className={`flex-1 p-3 rounded-lg text-sm font-medium ${
                    challengeType === "more_lessons_today"
                      ? "bg-accent-purple text-white"
                      : "bg-dark-300 text-text-muted"
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  More Lessons
                </button>
              </div>

              <button
                onClick={createChallenge}
                disabled={!selectedFriend}
                className="w-full py-3 bg-gradient-brand text-white rounded-lg font-medium disabled:opacity-50"
              >
                Send Challenge
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Challenges */}
      {pendingChallenges.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-text-muted mb-2">Incoming Challenges</p>
          {pendingChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="flex items-center justify-between p-3 bg-accent-purple/10 rounded-xl mb-2"
            >
              <div>
                <p className="text-sm text-text-primary">
                  {getName(challenge)} challenges you!
                </p>
                <p className="text-xs text-text-muted">
                  {getChallengeLabel(challenge.challenge_type)} - +{challenge.xp_reward} XP
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => respondToChallenge(challenge.id, true)}
                  className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToChallenge(challenge.id, false)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Challenges */}
      {activeChallenges.length > 0 ? (
        <div className="space-y-2">
          {activeChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="p-4 bg-dark-200/50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-text-primary">
                  vs {getName(challenge)}
                </p>
                <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full">
                  {getChallengeLabel(challenge.challenge_type)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-text-primary">{challenge.challenger_score}</p>
                  <p className="text-xs text-text-muted">You</p>
                </div>
                <div className="text-text-muted text-lg">vs</div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-text-primary">{challenge.challenged_score}</p>
                  <p className="text-xs text-text-muted">Them</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pendingChallenges.length === 0 ? (
        <div className="text-center py-8">
          <Swords className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
          <p className="text-text-muted text-sm">No active challenges</p>
          <p className="text-text-muted text-xs">Challenge a friend to compete!</p>
        </div>
      ) : null}
    </motion.div>
  );
}
