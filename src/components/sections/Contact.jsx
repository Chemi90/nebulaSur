import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

const INITIAL_STATE = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
  consent: false
}

const NETLIFY_FORM_NAME = 'contact'
const NETLIFY_EMAIL_SUBJECT = 'Nueva solicitud desde Nebula Sur'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value) {
  if (!value.trim()) {
    return true
  }

  const digits = value.replace(/\D/g, '')
  return digits.length >= 6 && digits.length <= 15
}

export default function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const serviceOptions = useMemo(() => {
    const items = t('contact.form.services')
    return Array.isArray(items) ? items : []
  }, [t])

  const contactDetails = useMemo(() => ([
    { label: t('contact.detailLabels.email'), value: t('contact.details.email') },
    { label: t('contact.detailLabels.calls'), value: t('contact.details.callPhone') },
    { label: t('contact.detailLabels.whatsapp'), value: t('contact.details.whatsappPhones') },
    { label: t('contact.detailLabels.location'), value: t('contact.details.location') }
  ]), [t])

  const validate = () => {
    const nextErrors = {}

    if (formData.name.trim().length < 2) {
      nextErrors.name = t('contact.form.errors.name')
    }

    if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = t('contact.form.errors.email')
    }

    if (!isValidPhone(formData.phone)) {
      nextErrors.phone = t('contact.form.errors.phone')
    }

    if (formData.company.trim().length < 2) {
      nextErrors.company = t('contact.form.errors.company')
    }

    if (!formData.service) {
      nextErrors.service = t('contact.form.errors.service')
    }

    if (formData.message.trim().length < 20) {
      nextErrors.message = t('contact.form.errors.message')
    }

    if (!formData.consent) {
      nextErrors.consent = t('contact.form.errors.consent')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('idle')

    if (!validate()) {
      return
    }

    const selectedService = serviceOptions.find((option) => option.value === formData.service)
    const selectedServiceLabel = selectedService?.label || formData.service
    const payload = new URLSearchParams({
      'form-name': NETLIFY_FORM_NAME,
      subject: NETLIFY_EMAIL_SUBJECT,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      service: formData.service,
      service_label: selectedServiceLabel,
      message: formData.message.trim(),
      consent: formData.consent ? 'yes' : 'no'
    })

    try {
      setStatus('submitting')

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      })

      if (!response.ok) {
        throw new Error('Contact form submission failed')
      }

      setFormData(INITIAL_STATE)
      setErrors({})
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-grid">
        <div className="contact-content">
          <p className="eyebrow">{t('contact.eyebrow')}</p>
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-subtitle align-left">{t('contact.subtitle')}</p>

          <div className="contact-details">
            {contactDetails.map((item) => (
              <article key={item.label} className="contact-detail-card">
                <p className="contact-detail-label">{item.label}</p>
                <p className="contact-detail-value">{item.value}</p>
              </article>
            ))}
          </div>
        </div>

        <form
          className="contact-form"
          name={NETLIFY_FORM_NAME}
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          noValidate
        >
          <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />
          <input type="hidden" name="subject" value={NETLIFY_EMAIL_SUBJECT} data-remove-prefix="" />

          <label>
            {t('contact.form.name')}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </label>

          <label>
            {t('contact.form.email')}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </label>

          <label>
            {t('contact.form.phone')}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </label>

          <label>
            {t('contact.form.company')}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
            {errors.company && <span className="form-error">{errors.company}</span>}
          </label>

          <label>
            {t('contact.form.service')}
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">{t('contact.form.servicePlaceholder')}</option>
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.service && <span className="form-error">{errors.service}</span>}
          </label>

          <label>
            {t('contact.form.message')}
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('contact.form.messagePlaceholder')}
              required
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </label>

          <label className="consent-row">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            <span>{t('contact.form.consent')}</span>
          </label>
          {errors.consent && <span className="form-error">{errors.consent}</span>}

          <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? t('contact.form.sending') : t('contact.form.submit')}
          </button>

          {status === 'success' && <p className="form-success">{t('contact.form.success')}</p>}
          {status === 'error' && <p className="form-error form-status">{t('contact.form.error')}</p>}
        </form>
      </div>
    </section>
  )
}
