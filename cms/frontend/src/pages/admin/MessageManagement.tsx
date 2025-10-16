import { useState, useEffect } from 'react';
import { Mail, Eye, Trash2, Archive, Check, Clock, MessageSquare } from 'lucide-react';
import api from '@services/api';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface MessageStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
}

export default function MessageManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadMessages();
    loadStats();
  }, [selectedStatus]);

  const loadMessages = async () => {
    try {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};

      const response = await api.get('/messages', {
        params,
      });

      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to load messages', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/messages/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setAdminNotes(message.notes || '');
    setShowDetailModal(true);

    // Auto-mark as read if new
    if (message.status === 'new') {
      await updateMessageStatus(message.id, 'read');
    }
  };

  const updateMessageStatus = async (
    id: string,
    status: 'new' | 'read' | 'replied' | 'archived',
    notes?: string
  ) => {
    try {
      await api.patch(`/messages/${id}`, { status, notes });

      // Refresh messages
      loadMessages();
      loadStats();

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status, notes });
      }

      toast.success('Message status updated');
    } catch (error) {
      console.error('Failed to update message', error);
      toast.error('Failed to update message');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/messages/${id}`);

      toast.success('Message deleted');
      setShowDetailModal(false);
      loadMessages();
      loadStats();
    } catch (error) {
      console.error('Failed to delete message', error);
      toast.error('Failed to delete message');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;

    await updateMessageStatus(selectedMessage.id, selectedMessage.status, adminNotes);
  };

  // Sanitize output for XSS protection
  const sanitizeOutput = (text: string) => {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800 border-blue-300',
      read: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      replied: 'bg-green-100 text-green-800 border-green-300',
      archived: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    const icons = {
      new: <Mail className="h-3 w-3" />,
      read: <Eye className="h-3 w-3" />,
      replied: <Check className="h-3 w-3" />,
      archived: <Archive className="h-3 w-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${badges[status as keyof typeof badges]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary-cyan" />
          <h1 className="text-3xl font-bold text-primary-navy">Messages</h1>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="glass-card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-primary-navy">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="glass-card p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedStatus('new')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">New</p>
                <p className="text-2xl font-bold text-blue-700">{stats.new}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="glass-card p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedStatus('read')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Read</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.read}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="glass-card p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedStatus('replied')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Replied</p>
                <p className="text-2xl font-bold text-green-700">{stats.replied}</p>
              </div>
              <Check className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="glass-card p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedStatus('archived')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-700">{stats.archived}</p>
              </div>
              <Archive className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-accent-blue to-accent-teal text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-accent-blue/5 to-accent-teal/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No messages found
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-6 py-4">{getStatusBadge(message.status)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {sanitizeOutput(message.name)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sanitizeOutput(message.email)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">
                      {sanitizeOutput(message.subject)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMessage(message);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold text-primary-navy">Message Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(selectedMessage.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                    className="btn-secondary text-sm"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                    className="btn-primary text-sm"
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                    className="btn-secondary text-sm"
                  >
                    Archive
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{sanitizeOutput(selectedMessage.name)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                    {sanitizeOutput(selectedMessage.email)}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{sanitizeOutput(selectedMessage.phone)}</p>
                  </div>
                )}
                {selectedMessage.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <p className="text-gray-900">{sanitizeOutput(selectedMessage.company)}</p>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-gray-900 font-medium">{sanitizeOutput(selectedMessage.subject)}</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{sanitizeOutput(selectedMessage.message)}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add internal notes..."
                />
                <button onClick={handleSaveNotes} className="btn-primary mt-2 text-sm">
                  Save Notes
                </button>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-4">
                <div>
                  <span className="font-medium">Created:</span> {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
                {selectedMessage.ipAddress && (
                  <div>
                    <span className="font-medium">IP:</span> {selectedMessage.ipAddress}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button onClick={() => setShowDetailModal(false)} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
