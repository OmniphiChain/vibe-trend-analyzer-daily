import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye, Users, MessageSquare, Navigation } from "lucide-react";
import { UserAvatar } from "../social/UserAvatar";
import { UsernameLink } from "../social/UsernameLink";
import { MentionText } from "../social/MentionText";
import { ChatMessage } from "../social/ChatMessage";
import { ProfileNavigationProvider } from "../social/ProfileNavigationProvider";

interface ProfileNavigationIntegrationGuideProps {
  onNavigateToProfile?: (userId: string) => void;
}

export const ProfileNavigationIntegrationGuide: React.FC<ProfileNavigationIntegrationGuideProps> = ({
  onNavigateToProfile
}) => {
  const handleNavigation = (section: string, userId?: string) => {
    console.log(`Navigate to: ${section}`, userId ? `for user: ${userId}` : '');
    onNavigateToProfile?.(userId || 'current-user');
  };

  const sampleUser = {
    id: "user-demo",
    username: "cryptowolf",
    displayName: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    verified: true,
    premium: true,
    credibilityScore: 94,
  };

  return (
    <ProfileNavigationProvider
      onNavigate={handleNavigation}
      onTickerClick={(symbol) => console.log(`Navigate to ticker: ${symbol}`)}
      onHashtagClick={(hashtag) => console.log(`Navigate to hashtag: ${hashtag}`)}
      onFollow={(userId) => console.log(`Follow user: ${userId}`)}
      onUnfollow={(userId) => console.log(`Unfollow user: ${userId}`)}
    >
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Navigation className="h-6 w-6" />
              Profile Navigation Integration Guide
            </CardTitle>
            <p className="text-muted-foreground">
              Complete implementation guide for adding profile navigation to existing Community components
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">🧩 Components</TabsTrigger>
            <TabsTrigger value="examples">👀 Live Examples</TabsTrigger>
            <TabsTrigger value="integration">⚙️ Integration</TabsTrigger>
            <TabsTrigger value="code">💻 Code Examples</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🧑‍💼 UserAvatar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Clickable avatar with hover effects and status indicators
                  </p>
                  <div className="flex items-center gap-4">
                    <UserAvatar {...sampleUser} size="lg" showBadges onUserClick={onNavigateToProfile} />
                    <div className="text-xs space-y-1">
                      <div>✅ Hover animations</div>
                      <div>✅ Status rings for credibility</div>
                      <div>✅ Verification badges</div>
                      <div>✅ Multiple sizes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔗 UsernameLink</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Clickable username with badges and hover tooltips
                  </p>
                  <div className="space-y-2">
                    <UsernameLink {...sampleUser} showHandle onUserClick={onNavigateToProfile} />
                    <div className="text-xs space-y-1">
                      <div>✅ Hover tooltips</div>
                      <div>✅ Responsive badges</div>
                      <div>✅ Multiple display modes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💬 MentionText</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Parse and link @mentions, $tickers, #hashtags
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                    <MentionText
                      text="Hey @cryptowolf, what do you think about $NVDA and #AI trends?"
                      onUserClick={onNavigateToProfile}
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <div>✅ Auto-detection of mentions</div>
                    <div>✅ Ticker and hashtag support</div>
                    <div>✅ Click handlers for each type</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💭 ChatMessage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Complete chat message with all navigation features
                  </p>
                  <div className="text-xs space-y-1">
                    <div>✅ Integrated avatar + username</div>
                    <div>✅ Parsed message content</div>
                    <div>✅ Hover preview cards</div>
                    <div>✅ Role-based badges</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Examples Tab */}
          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Interactive Examples
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Try clicking on any username, avatar, or mention below
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Sizes */}
                <div>
                  <h4 className="font-semibold mb-3">Avatar Sizes & States</h4>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <UserAvatar {...sampleUser} size="sm" onUserClick={onNavigateToProfile} />
                    <UserAvatar {...sampleUser} size="md" onUserClick={onNavigateToProfile} />
                    <UserAvatar {...sampleUser} size="lg" showBadges onUserClick={onNavigateToProfile} />
                    <UserAvatar {...sampleUser} size="xl" showBadges onUserClick={onNavigateToProfile} />
                  </div>
                </div>

                {/* Username Links */}
                <div>
                  <h4 className="font-semibold mb-3">Username Display Options</h4>
                  <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <UsernameLink {...sampleUser} showHandle={false} onUserClick={onNavigateToProfile} />
                    <UsernameLink {...sampleUser} showHandle onUserClick={onNavigateToProfile} />
                    <UsernameLink {...sampleUser} showHandle showBadges size="lg" onUserClick={onNavigateToProfile} />
                  </div>
                </div>

                {/* Rich Text Examples */}
                <div>
                  <h4 className="font-semibold mb-3">Rich Text with Links</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <MentionText
                        text="🔥 @cryptowolf just posted an amazing analysis on $NVDA! The #AI sector is looking incredible. What do you think @techtrader?"
                        onUserClick={onNavigateToProfile}
                      />
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border">
                      <MentionText
                        text="Breaking: $TSLA earnings beat expectations! 🚀 Thanks @marketguru for the heads up. #earnings #bullish"
                        onUserClick={onNavigateToProfile}
                      />
                    </div>
                  </div>
                </div>

                {/* Chat Message Example */}
                <div>
                  <h4 className="font-semibold mb-3">Chat Message with Hover Cards</h4>
                  <ChatMessage
                    id="demo-1"
                    userId="user-demo"
                    username="cryptowolf"
                    displayName="Alex Thompson"
                    avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
                    content="Just analyzed the latest market trends. @techtrader what's your take on $NVDA and the #AI boom? 🚀"
                    timestamp="2 minutes ago"
                    verified={true}
                    premium={true}
                    credibilityScore={94}
                    userRole="verified"
                    likes={12}
                    replies={3}
                    onLike={() => console.log('Liked message')}
                    onReply={() => console.log('Reply to message')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏗️ Setup Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge className="text-xs">1</Badge>
                      <div>
                        <strong>Wrap your app with ProfileNavigationProvider</strong>
                        <p className="text-muted-foreground text-xs">Provides navigation context to all child components</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge className="text-xs">2</Badge>
                      <div>
                        <strong>Replace existing avatars with UserAvatar</strong>
                        <p className="text-muted-foreground text-xs">Add clickable functionality and hover effects</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge className="text-xs">3</Badge>
                      <div>
                        <strong>Replace usernames with UsernameLink</strong>
                        <p className="text-muted-foreground text-xs">Add badges, tooltips, and navigation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge className="text-xs">4</Badge>
                      <div>
                        <strong>Wrap text content with MentionText</strong>
                        <p className="text-muted-foreground text-xs">Auto-parse @mentions, $tickers, #hashtags</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📍 Where to Apply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Community Posts & Comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Chat Messages & Rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Trading Rooms & Voice Chat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Leaderboards & Rankings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Implementation Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h5 className="font-medium">✅ Required Updates:</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Community feed posts</li>
                      <li>• Chat message components</li>
                      <li>• Trading room participants</li>
                      <li>• Comment sections</li>
                      <li>• User search results</li>
                      <li>• Leaderboard entries</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">🎨 Optional Enhancements:</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Hover preview cards</li>
                      <li>• Quick follow/unfollow</li>
                      <li>• Status indicators</li>
                      <li>• Role-based styling</li>
                      <li>• Mobile touch optimization</li>
                      <li>• Keyboard navigation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Examples Tab */}
          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Implementation Examples
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Provider Setup</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<ProfileNavigationProvider
  onNavigate={handleNavigation}
  onTickerClick={handleTickerClick}
  onHashtagClick={handleHashtagClick}
  onFollow={handleFollow}
  onUnfollow={handleUnfollow}
>
  {/* Your community components */}
</ProfileNavigationProvider>`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2. Replace Avatar Components</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Before
<Avatar>
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{user.name[0]}</AvatarFallback>
</Avatar>

// After
<UserAvatar
  userId={user.id}
  username={user.username}
  avatar={user.avatar}
  verified={user.verified}
  premium={user.premium}
  credibilityScore={user.credibilityScore}
  showBadges
  onUserClick={navigateToProfile}
/>`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3. Enhanced Text Content</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Before
<p>{message.content}</p>

// After
<MentionText
  text={message.content}
  onUserClick={navigateToProfile}
  onTickerClick={navigateToTicker}
  onHashtagClick={navigateToHashtag}
/>`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">4. Complete Chat Message</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<ChatMessage
  id={message.id}
  userId={message.userId}
  username={message.username}
  displayName={message.displayName}
  avatar={message.avatar}
  content={message.content}
  timestamp={message.timestamp}
  verified={message.verified}
  premium={message.premium}
  credibilityScore={message.credibilityScore}
  userRole={message.role}
  onLike={handleLike}
  onReply={handleReply}
/>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProfileNavigationProvider>
  );
};

export default ProfileNavigationIntegrationGuide;
