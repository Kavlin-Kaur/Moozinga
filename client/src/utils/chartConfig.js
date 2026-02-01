import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const createPieChartConfig = (moodDistribution) => {
  const labels = [];
  const data = [];
  const colors = [];

  Object.values(moodDistribution).forEach(mood => {
    if (mood.count > 0) {
      labels.push(`${mood.emoji} ${mood.label}`);
      data.push(mood.percentage);
      colors.push(mood.color);
    }
  });

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: colors.map(c => c + 'CC'),
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };
};

export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#fff',
        font: {
          size: 14,
          weight: '500'
        },
        padding: 15
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context) => {
          return ` ${context.label}: ${context.parsed}%`;
        }
      }
    }
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1500,
    easing: 'easeInOutQuart'
  }
};
