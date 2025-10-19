const SensorCard = ({ label, value, unit, icon }) => {
  const getIconComponent = () => {
    const icons = {
      voltage: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      current: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      power: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      temperature: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      efficiency: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      irradiance: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
    return icons[icon] || icons.power
  }

  const getGradientColor = () => {
    const gradients = {
      voltage: 'from-yellow-400 to-orange-500',
      current: 'from-blue-400 to-cyan-500',
      power: 'from-green-400 to-emerald-500',
      temperature: 'from-red-400 to-pink-500',
      efficiency: 'from-purple-400 to-indigo-500',
      irradiance: 'from-amber-400 to-yellow-500'
    }
    return gradients[icon] || 'from-blue-400 to-cyan-500'
  }

  return (
    <div className="card group hover:scale-105 cursor-default">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </h4>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${getGradientColor()} text-white group-hover:scale-110 transition-transform duration-300`}>
          {getIconComponent()}
        </div>
      </div>
      
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {typeof value === 'number' ? value.toFixed(2) : value || '--'}
        </span>
        <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
          {unit}
        </span>
      </div>
      
      <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getGradientColor()} animate-pulse`}
          style={{ width: '70%' }}
        />
      </div>
    </div>
  )
}

export default SensorCard