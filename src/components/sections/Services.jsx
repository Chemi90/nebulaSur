import { useLanguage } from '../../context/LanguageContext'

export default function Services() {
  const { t } = useLanguage()
  const items = t('services.items')
  const services = Array.isArray(items) ? items : []
  const serviceGroups = t('services.groups')
  const groups = Array.isArray(serviceGroups) ? serviceGroups : []
  const groupsAria = t('services.groupsAria')
  const taskSingular = t('services.taskSingular')
  const taskPlural = t('services.taskPlural')

  const resolveGroupServices = (group) => {
    const serviceIndexes = Array.isArray(group.serviceIndexes) ? group.serviceIndexes : []

    return serviceIndexes
      .map((serviceIndex) => ({
        service: services[serviceIndex]
      }))
      .filter(({ service }) => Boolean(service))
  }

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <p className="eyebrow">{t('services.eyebrow')}</p>
        <h2 className="section-title">{t('services.title')}</h2>
        <p className="section-subtitle">{t('services.subtitle')}</p>

        <div className="service-groups" aria-label={groupsAria}>
          {groups.map((group) => {
            const groupedServices = resolveGroupServices(group)
            const taskCount = groupedServices.reduce((total, { service }) => {
              const tasks = Array.isArray(service.tasks) ? service.tasks : []
              return total + Math.max(tasks.length, 1)
            }, 0)

            if (groupedServices.length === 0) return null

            return (
              <details key={group.title} className="service-group">
                <summary className="service-group-summary">
                  <span className="service-group-copy">
                    <span className="service-group-heading">
                      <span className="service-group-title">{group.title}</span>
                      <span className="service-group-meta">
                        {taskCount} {taskCount === 1 ? taskSingular : taskPlural}
                      </span>
                    </span>
                    <span className="service-group-description">{group.description}</span>
                  </span>
                </summary>

                <div className="service-group-body">
                  <div className="services-grid service-group-grid">
                    {groupedServices.map(({ service }) => {
                      const tasks = Array.isArray(service.tasks) ? service.tasks : []

                      return (
                        <article key={service.title} className="service-card service-task-card">
                          <h3>{service.title}</h3>
                          {tasks.length > 0 ? (
                            <ul className="service-task-list">
                              {tasks.map((task) => (
                                <li key={task}>{task}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>{service.description}</p>
                          )}
                        </article>
                      )
                    })}
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}
