'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Settings, Trash2, Mail, Shield, Crown } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Owner',
      status: 'Active',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'Member',
      status: 'Pending',
      lastLogin: 'Never'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (inviteEmail) {
      // Send invitation
      console.log('Inviting:', inviteEmail);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'Admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      default:
        return <UserPlus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-yellow-100 text-yellow-800';
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserPlus className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Users</h1>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </div>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Total Users</div>
                <p className="text-sm text-muted-foreground">{users.length} members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Active</div>
                <p className="text-sm text-muted-foreground">{users.filter(u => u.status === 'Active').length} users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">Pending</div>
                <p className="text-sm text-muted-foreground">{users.filter(u => u.status === 'Pending').length} invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Admins</div>
                <p className="text-sm text-muted-foreground">{users.filter(u => u.role === 'Admin' || u.role === 'Owner').length} admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Users List */}
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-600">{user.name.charAt(0)}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{user.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span>{user.role}</span>
                        </div>
                      </div>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  {user.role !== 'Owner' && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite}>Send Invitation</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}