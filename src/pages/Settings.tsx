import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Key,
  Smartphone,
  Mail,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { settings, updateSettings, saveSettings, isLoading } = useSettings();
  const { user } = useAuth();

  const handleSave = async () => {
    try {
      await saveSettings();
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  const handlePrivacyChange = (key: keyof typeof settings.privacy, value: boolean) => {
    updateSettings({
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences and security settings
            </p>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark crypto-glow"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-card-secondary">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-primary">
              <Palette className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-primary">
              <Database className="w-4 h-4 mr-2" />
              API & Data
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={user?.firstName || ''}
                      disabled
                      className="mt-2 bg-input border-card-border opacity-60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={user?.lastName || ''}
                      disabled
                      className="mt-2 bg-input border-card-border opacity-60"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-2 bg-input border-card-border opacity-60"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={settings.bio}
                    onChange={(e) => handleSettingChange("bio", e.target.value)}
                    className="mt-2 bg-input border-card-border resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <Separator className="bg-card-border" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  
                  <Separator className="bg-card-border" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when prices hit your targets
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.priceAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('priceAlerts', checked)}
                    />
                  </div>
                  
                  <Separator className="bg-card-border" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">Prediction Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for new AI predictions
                      </p>
                    </div>
                    <Switch
                      checked={settings.predictionAlerts}
                      onCheckedChange={(checked) => handleSettingChange("predictionAlerts", checked)}
                    />
                  </div>
                  
                  <Separator className="bg-card-border" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">News Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Breaking crypto news and market updates
                      </p>
                    </div>
                    <Switch
                      checked={settings.newsAlerts}
                      onCheckedChange={(checked) => handleSettingChange("newsAlerts", checked)}
                    />
                  </div>
                  
                  <Separator className="bg-card-border" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly portfolio and market summary
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReport}
                      onCheckedChange={(checked) => handleSettingChange("weeklyReport", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
                
                <Separator className="bg-card-border" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => handleSettingChange("loginAlerts", checked)}
                  />
                </div>
                
                <Separator className="bg-card-border" />
                
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange("sessionTimeout", value)}>
                    <SelectTrigger className="mt-2 bg-input border-card-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-card-border">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-danger mt-0.5" />
                    <div>
                      <h4 className="font-medium text-danger">Danger Zone</h4>
                      <p className="text-sm text-danger/80 mt-1">
                        These actions are irreversible. Please proceed with caution.
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm" className="border-danger/20 text-danger hover:bg-danger/10">
                          Change Password
                        </Button>
                        <Button variant="outline" size="sm" className="border-danger/20 text-danger hover:bg-danger/10">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="glass-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <span>App Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize your app experience and display settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => updateSettings({ currency: value as any })}>
                      <SelectTrigger className="mt-2 bg-input border-card-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-card-border">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="BTC">BTC (₿)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                      <SelectTrigger className="mt-2 bg-input border-card-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-card-border">
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                        <SelectItem value="JST">Japan Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={settings.theme} onValueChange={(value) => updateSettings({ theme: value as any })}>
                      <SelectTrigger className="mt-2 bg-input border-card-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-card-border">
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSettings({ language: value as any })}>
                      <SelectTrigger className="mt-2 bg-input border-card-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-card-border">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-6">
            <Card className="glass-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-primary" />
                  <span>API & Integrations</span>
                </CardTitle>
                <CardDescription>
                  Manage API keys and external integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="relative mt-2">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={settings.apiKey}
                      onChange={(e) => handleSettingChange("apiKey", e.target.value)}
                      className="bg-input border-card-border pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your API key for accessing CryptoNova services
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-app.com/webhook"
                    value={settings.webhookUrl}
                    onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
                    className="mt-2 bg-input border-card-border"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Receive real-time updates via webhook
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-card-border hover:bg-card-secondary">
                    <Key className="w-4 h-4 mr-2" />
                    Generate New Key
                  </Button>
                  <Button variant="outline" className="border-card-border hover:bg-card-secondary">
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;