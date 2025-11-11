import { useThemeContext } from '@/common/context'
import colors from '@/constants/colors'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'

interface ApexRadarMultipleProps {}

const ApexRadarMultiple: React.FC<ApexRadarMultipleProps> = () => {
  const { settings } = useThemeContext()
  const selectedColor = settings.color as keyof typeof colors
  const themeColor = colors[selectedColor] || selectedColor
  const series = [
    {
      name: 'Radar Polygon',
      data: [20, 100, 40, 30, 50, 80, 33],
    },
  ]

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radar',
      foreColor: '#adb5bd',
      fontFamily: 'Public Sans, sans-serif',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      radar: {
        size: 140,
      },
    },
    colors: [themeColor],
    markers: {
      size: 4,
      colors: ['#fff'],
      strokeWidth: 2,
    },
    tooltip: {
      theme: 'dark',
    },
    xaxis: {
      categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
  }

  return (
    <>
      <ReactApexChart options={options} series={series} type="radar" height={380} />
    </>
  )
}

export default ApexRadarMultiple
