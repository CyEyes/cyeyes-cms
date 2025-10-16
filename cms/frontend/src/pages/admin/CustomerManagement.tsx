import { useEffect, useState } from 'react';
import { customerService, Customer, CreateCustomerRequest } from '@services/customer.service';
import { Plus, Edit, Trash2, X, Save, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleApiError } from '@utils/errorHandler';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    companyName: '',
    logo: '',
    website: '',
    industry: '',
    showHomepage: false,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.list({ limit: 100 });
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        companyName: customer.companyName,
        logo: customer.logo || '',
        website: customer.website || '',
        industry: customer.industry || '',
        showHomepage: customer.showHomepage,
        displayOrder: customer.displayOrder,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        companyName: '',
        logo: '',
        website: '',
        industry: '',
        showHomepage: false,
        displayOrder: customers.length,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, formData);
        toast.success('Customer updated successfully');
      } else {
        await customerService.create(formData);
        toast.success('Customer created successfully');
      }
      handleCloseModal();
      fetchCustomers();
    } catch (error: any) {
      handleApiError(error, 'Failed to save customer');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await customerService.delete(id);
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-navy">Customers</h2>
          <p className="text-text-secondary mt-1">Manage customer testimonials and case studies</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Customer
        </button>
      </div>

      {/* Customers Grid */}
      {loading ? (
        <div className="glass-card p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary mt-4">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">No customers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="glass-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {customer.logo ? (
                    <img
                      src={customer.logo}
                      alt={customer.companyName}
                      className="h-16 w-auto object-contain mb-3"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3">
                      {customer.companyName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(customer)}
                    className="text-gray-600 hover:text-primary-cyan"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id, customer.companyName)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-heading font-bold text-primary-navy mb-1">
                {customer.companyName}
              </h3>
              <p className="text-sm text-primary-cyan font-medium mb-2">{customer.industry}</p>
              {customer.testimonial?.quoteEn && (
                <p className="text-sm text-text-secondary line-clamp-3 mb-3 italic">
                  "{customer.testimonial.quoteEn}"
                </p>
              )}
              {customer.website && (
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-cyan hover:underline block mb-2"
                >
                  {customer.website}
                </a>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-text-secondary">Order: {customer.displayOrder}</span>
                {customer.showHomepage && (
                  <span className="text-xs bg-primary-cyan text-white px-2 py-0.5 rounded">
                    Homepage
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-heading font-bold text-primary-navy">
                {editingCustomer ? 'Edit Customer' : 'Add Customer'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo || ''}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showHomepage}
                      onChange={(e) => setFormData({ ...formData, showHomepage: e.target.checked })}
                      className="h-4 w-4 text-primary-cyan focus:ring-primary-cyan rounded"
                    />
                    <span className="text-sm font-medium text-text-primary">Show on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary inline-flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
