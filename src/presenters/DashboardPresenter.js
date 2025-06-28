import DashboardView from '../views/DashboardView.js';
import Chart from 'chart.js/auto';

class DashboardPresenter {
  constructor(model) {
    this.model = model;
    this.view = null;
    this.chart = null;
  }

  init() {
    // Add dashboard mode class to body
    document.body.classList.add('dashboard-mode');

    this.view = new DashboardView();
    this.view.render();
    this.view.bindEvents(this);

    // Initialize chart after view is rendered
    setTimeout(() => {
      this.initializeChart();
    }, 100);

    // Load and display user stats
    this.loadUserStats();
  }

  initializeChart() {
    const progressCtx = document.getElementById('progressChart');
    if (!progressCtx) {
      console.error('Progress chart canvas not found');
      return;
    }

    const brandColors = {
      brightBlue: '#0079FF',
      deepBlue: '#004AAD',
    };

    this.chart = new Chart(progressCtx, {
      type: 'line',
      data: {
        labels: ['4 Minggu Lalu', '3 Minggu Lalu', '2 Minggu Lalu', 'Minggu Lalu', 'Minggu Ini'],
        datasets: [{
          label: 'Skor Aksen',
          data: [75, 78, 77, 80, 82],
          backgroundColor: 'rgba(0, 121, 255, 0.1)',
          borderColor: brandColors.brightBlue,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: brandColors.deepBlue,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#f1f5f9',
              lineWidth: 1
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 14
              },
              padding: 10
            }
          },
          y: {
            beginAtZero: false,
            min: 60,
            max: 100,
            grid: {
              display: true,
              color: '#f1f5f9',
              lineWidth: 1
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 14
              },
              padding: 15,
              stepSize: 5,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f8fafc',
            bodyColor: '#f8fafc',
            borderColor: '#475569',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(tooltipItems) {
                const item = tooltipItems[0];
                let label = item.chart.data.labels[item.dataIndex];
                return Array.isArray(label) ? label.join(' ') : label;
              },
              label: function(context) {
                return `Skor: ${context.parsed.y}%`;
              }
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 10,
            hoverBorderWidth: 3,
            radius: 6
          },
          line: {
            borderWidth: 4
          }
        },
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          }
        }
      }
    });
  }

  loadUserStats() {
    // Get stats from model or use default values
    const stats = this.model.getUserStats() || {
      accentScore: 82,
      completedExercises: 128,
      trainingTime: '14 Jam',
      categoriesTried: '5/7',
      categoriesMastered: 2
    };

    this.view.updateStats(stats);
  }

  handleStartTraining() {
    console.log('Starting training...');
    // For now, just show an alert. Later this can navigate to a training module
    alert('Fitur latihan akan segera tersedia!');
  }

  handleCategorySelect(categoryTitle) {
    console.log('Selected category:', categoryTitle);
    // For now, just show an alert. Later this can navigate to specific category training
    alert(`Kategori "${categoryTitle}" akan segera tersedia!`);
  }

  updateProgressData(newData) {
    if (this.chart && newData) {
      this.chart.data.datasets[0].data = newData;
      this.chart.update();
    }
  }

  destroy() {
    // Remove dashboard mode class from body
    document.body.classList.remove('dashboard-mode');

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
}

export default DashboardPresenter;
