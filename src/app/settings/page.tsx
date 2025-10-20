'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Form, { FormField, FormLabel, FormActions, FormDescription } from '@/components/ui/Form';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Alert from '@/components/ui/Alert';
import { useNotifications } from '@/hooks/useNotifications';
import ApiTokensSection from '@/components/settings/ApiTokensSection';

// Datos de ejemplo
const restaurantSettings = {
  name: 'Mi Restaurante',
  address: 'Calle Principal 123, Madrid',
  phone: '912345678',
  email: 'info@mirestaurante.com',
  website: 'www.mirestaurante.com',
  description: 'Un restaurante especializado en cocina mediterránea con ingredientes frescos y de temporada.',
  openingHours: {
    monday: { open: '12:00', close: '23:00', isOpen: true },
    tuesday: { open: '12:00', close: '23:00', isOpen: true },
    wednesday: { open: '12:00', close: '23:00', isOpen: true },
    thursday: { open: '12:00', close: '23:00', isOpen: true },
    friday: { open: '12:00', close: '00:00', isOpen: true },
    saturday: { open: '13:00', close: '00:00', isOpen: true },
    sunday: { open: '13:00', close: '23:00', isOpen: false },
  },
  socialMedia: {
    facebook: 'https://facebook.com/mirestaurante',
    instagram: 'https://instagram.com/mirestaurante',
    twitter: 'https://twitter.com/mirestaurante',
  },
  reservations: {
    enabled: true,
    advanceBookingDays: 30,
    maxPartySize: 12,
    minPartySize: 1,
    requiresApproval: false,
    autoConfirm: true,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    emailNotifications: {
      bookingConfirmation: true,
      bookingReminder: true,
      bookingCancellation: true,
    },
    smsNotifications: {
      bookingConfirmation: false,
      bookingReminder: false,
      bookingCancellation: false,
    },
  },
};

const themeOptions = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'auto', label: 'Automático' },
];

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(restaurantSettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  });
  
  const { showSuccess, showError } = useNotifications();

  const handleEditRestaurant = () => {
    setFormData({
      name: settings.name,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      website: settings.website,
      description: settings.description,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSettings(prev => ({
        ...prev,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        description: formData.description,
      }));
      
      showSuccess('Configuración guardada correctamente');
      setIsModalOpen(false);
    } catch (error) {
      showError('Ha ocurrido un error al guardar la configuración');
    }
  };

  const handleToggleReservationSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      reservations: {
        ...prev.reservations,
        [key]: value,
      },
    }));
  };

  const handleToggleNotificationSetting = (category: string, key: string, value: boolean) => {
    setSettings(prev => {
      const notifications = { ...prev.notifications };
      
      // Use type assertion to handle the complex type structure
      if (category === 'emailNotifications') {
        notifications.emailNotifications = {
          ...notifications.emailNotifications,
          [key]: value,
        };
      } else if (category === 'smsNotifications') {
        notifications.smsNotifications = {
          ...notifications.smsNotifications,
          [key]: value,
        };
      } else {
        // For other categories, use type assertion
        const currentCategory = notifications[category as keyof typeof notifications] as any;
        notifications[category as keyof typeof notifications] = {
          ...currentCategory,
          [key]: value,
        };
      }
      
      return {
        ...prev,
        notifications,
      };
    });
  };

  const sections = [
    { id: 'general', label: 'Información General', icon: '🏢' },
    { id: 'reservations', label: 'Reservas', icon: '📅' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'appearance', label: 'Apariencia', icon: '🎨' },
    { id: 'api', label: 'API', icon: '🔑' },
    { id: 'account', label: 'Cuenta', icon: '👤' },
  ];

  return (
    <ProtectedRoute>
      <Layout
        title="Configuración"
        subtitle="Administra la configuración de tu restaurante"
        restaurantName="Mi Restaurante"
      >
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Menú lateral */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 flex items-center ${
                          activeSection === section.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <span className="mr-3 text-lg">{section.icon}</span>
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-3">
              {activeSection === 'general' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                        <div>
                          <p className="font-medium text-secondary-900">Nombre del restaurante</p>
                          <p className="text-sm text-secondary-600">{settings.name}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleEditRestaurant}>
                          Editar
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                        <div>
                          <p className="font-medium text-secondary-900">Dirección</p>
                          <p className="text-sm text-secondary-600">{settings.address}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleEditRestaurant}>
                          Editar
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                        <div>
                          <p className="font-medium text-secondary-900">Teléfono</p>
                          <p className="text-sm text-secondary-600">{settings.phone}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleEditRestaurant}>
                          Editar
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                        <div>
                          <p className="font-medium text-secondary-900">Email</p>
                          <p className="text-sm text-secondary-600">{settings.email}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleEditRestaurant}>
                          Editar
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                        <div>
                          <p className="font-medium text-secondary-900">Sitio web</p>
                          <p className="text-sm text-secondary-600">{settings.website}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleEditRestaurant}>
                          Editar
                        </Button>
                      </div>
                      
                      <div className="py-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-secondary-900">Descripción</p>
                          <Button size="sm" variant="outline" onClick={handleEditRestaurant}>
                            Editar
                          </Button>
                        </div>
                        <p className="text-sm text-secondary-600">{settings.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'reservations' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Reservas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Alert variant="info">
                        Configura cómo funcionan las reservas en tu restaurante
                      </Alert>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-secondary-900">Habilitar reservas</p>
                            <p className="text-sm text-secondary-600">Permite que los clientes hagan reservas online</p>
                          </div>
                          <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.reservations.enabled ? 'bg-primary-600' : 'bg-secondary-200'
                            }`}
                            onClick={() => handleToggleReservationSetting('enabled', !settings.reservations.enabled)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.reservations.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-secondary-900">Confirmación automática</p>
                            <p className="text-sm text-secondary-600">Confirma automáticamente las reservas</p>
                          </div>
                          <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.reservations.autoConfirm ? 'bg-primary-600' : 'bg-secondary-200'
                            }`}
                            onClick={() => handleToggleReservationSetting('autoConfirm', !settings.reservations.autoConfirm)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.reservations.autoConfirm ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-secondary-900">Requiere aprobación</p>
                            <p className="text-sm text-secondary-600">Las reservas deben ser aprobadas manualmente</p>
                          </div>
                          <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.reservations.requiresApproval ? 'bg-primary-600' : 'bg-secondary-200'
                            }`}
                            onClick={() => handleToggleReservationSetting('requiresApproval', !settings.reservations.requiresApproval)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.reservations.requiresApproval ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div>
                          <p className="font-medium text-secondary-900 mb-2">Anticipación de reserva</p>
                          <p className="text-sm text-secondary-600 mb-2">Días máximos de anticipación para reservar</p>
                          <Input
                            type="number"
                            min="1"
                            max="365"
                            value={settings.reservations.advanceBookingDays}
                            onChange={(e) => handleToggleReservationSetting('advanceBookingDays', parseInt(e.target.value, 10))}
                          />
                        </div>
                        
                        <div>
                          <p className="font-medium text-secondary-900 mb-2">Tamaño del grupo</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-secondary-600 mb-1">Mínimo</p>
                              <Input
                                type="number"
                                min="1"
                                max="20"
                                value={settings.reservations.minPartySize}
                                onChange={(e) => handleToggleReservationSetting('minPartySize', parseInt(e.target.value, 10))}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-secondary-600 mb-1">Máximo</p>
                              <Input
                                type="number"
                                min="1"
                                max="50"
                                value={settings.reservations.maxPartySize}
                                onChange={(e) => handleToggleReservationSetting('maxPartySize', parseInt(e.target.value, 10))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Alert variant="info">
                        Configura cómo y cuándo se envían las notificaciones
                      </Alert>
                      
                      <div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-4">Notificaciones por Email</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-secondary-900">Habilitar notificaciones por email</p>
                              <p className="text-sm text-secondary-600">Envía notificaciones por email</p>
                            </div>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications.emailEnabled ? 'bg-primary-600' : 'bg-secondary-200'
                              }`}
                              onClick={() => handleToggleNotificationSetting('emailEnabled', 'emailEnabled', !settings.notifications.emailEnabled)}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          
                          {settings.notifications.emailEnabled && (
                            <div className="pl-4 space-y-3 border-l-2 border-secondary-200 ml-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-secondary-900">Confirmación de reserva</p>
                                <button
                                  type="button"
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    settings.notifications.emailNotifications.bookingConfirmation ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                  onClick={() => handleToggleNotificationSetting('emailNotifications', 'bookingConfirmation', !settings.notifications.emailNotifications.bookingConfirmation)}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      settings.notifications.emailNotifications.bookingConfirmation ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-secondary-900">Recordatorio de reserva</p>
                                <button
                                  type="button"
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    settings.notifications.emailNotifications.bookingReminder ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                  onClick={() => handleToggleNotificationSetting('emailNotifications', 'bookingReminder', !settings.notifications.emailNotifications.bookingReminder)}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      settings.notifications.emailNotifications.bookingReminder ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-secondary-900">Cancelación de reserva</p>
                                <button
                                  type="button"
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    settings.notifications.emailNotifications.bookingCancellation ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                  onClick={() => handleToggleNotificationSetting('emailNotifications', 'bookingCancellation', !settings.notifications.emailNotifications.bookingCancellation)}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      settings.notifications.emailNotifications.bookingCancellation ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-4">Notificaciones por SMS</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-secondary-900">Habilitar notificaciones por SMS</p>
                              <p className="text-sm text-secondary-600">Envía notificaciones por SMS</p>
                            </div>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications.smsEnabled ? 'bg-primary-600' : 'bg-secondary-200'
                              }`}
                              onClick={() => handleToggleNotificationSetting('smsEnabled', 'smsEnabled', !settings.notifications.smsEnabled)}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications.smsEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          
                          {settings.notifications.smsEnabled && (
                            <div className="pl-4 space-y-3 border-l-2 border-secondary-200 ml-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-secondary-900">Confirmación de reserva</p>
                                <button
                                  type="button"
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    settings.notifications.smsNotifications.bookingConfirmation ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                  onClick={() => handleToggleNotificationSetting('smsNotifications', 'bookingConfirmation', !settings.notifications.smsNotifications.bookingConfirmation)}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      settings.notifications.smsNotifications.bookingConfirmation ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-secondary-900">Recordatorio de reserva</p>
                                <button
                                  type="button"
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    settings.notifications.smsNotifications.bookingReminder ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                  onClick={() => handleToggleNotificationSetting('smsNotifications', 'bookingReminder', !settings.notifications.smsNotifications.bookingReminder)}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      settings.notifications.smsNotifications.bookingReminder ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-secondary-900">Cancelación de reserva</p>
                                <button
                                  type="button"
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    settings.notifications.smsNotifications.bookingCancellation ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                  onClick={() => handleToggleNotificationSetting('smsNotifications', 'bookingCancellation', !settings.notifications.smsNotifications.bookingCancellation)}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      settings.notifications.smsNotifications.bookingCancellation ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'appearance' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Apariencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Alert variant="info">
                        Personaliza la apariencia de tu aplicación
                      </Alert>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium text-secondary-900 mb-2">Tema</p>
                          <Select
                            value="light"
                            onChange={() => {}}
                            options={themeOptions}
                          />
                        </div>
                        
                        <div>
                          <p className="font-medium text-secondary-900 mb-2">Idioma</p>
                          <Select
                            value="es"
                            onChange={() => {}}
                            options={languageOptions}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'api' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tokens de API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ApiTokensSection />
                  </CardContent>
                </Card>
              )}

              {activeSection === 'account' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cuenta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Alert variant="info">
                        Gestiona tu cuenta y preferencias de usuario
                      </Alert>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                          <div>
                            <p className="font-medium text-secondary-900">Nombre de usuario</p>
                            <p className="text-sm text-secondary-600">admin</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                          <div>
                            <p className="font-medium text-secondary-900">Email</p>
                            <p className="text-sm text-secondary-600">admin@mirestaurante.com</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-secondary-200">
                          <div>
                            <p className="font-medium text-secondary-900">Contraseña</p>
                            <p className="text-sm text-secondary-600">********</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Cambiar
                          </Button>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="error">
                            Cerrar sesión
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
        >
          <Form onSubmit={handleSubmit}>
            <ModalHeader>
              Editar Información del Restaurante
            </ModalHeader>
            <ModalBody>
              <FormField>
                <FormLabel>Nombre del restaurante</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del restaurante"
                  required
                />
              </FormField>
              
              <FormField>
                <FormLabel>Dirección</FormLabel>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Dirección completa"
                  required
                />
              </FormField>
              
              <FormField>
                <FormLabel>Teléfono</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Teléfono de contacto"
                  required
                />
              </FormField>
              
              <FormField>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email de contacto"
                  required
                />
              </FormField>
              
              <FormField>
                <FormLabel>Sitio web</FormLabel>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.ejemplo.com"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Descripción</FormLabel>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descripción del restaurante"
                />
              </FormField>
            </ModalBody>
            <ModalFooter>
              <FormActions align="between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar
                </Button>
              </FormActions>
            </ModalFooter>
          </Form>
        </Modal>
      </Layout>
    </ProtectedRoute>
  );
}