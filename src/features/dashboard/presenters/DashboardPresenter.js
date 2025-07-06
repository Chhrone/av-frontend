import DashboardView from '../views/DashboardView.js';
import Chart from 'chart.js/auto';
import { NavbarPresenter, FooterPresenter } from '../../../shared/index.js';


class DashboardPresenter {
  constructor(model) {
    this.model = model;
    this.view = null;
    this.chart = null;
    this.navbar = new NavbarPresenter();
    // this.footerPresenter = null;
  }

  async init() {
    console.log('[DashboardPresenter] init dipanggil');
    document.body.classList.add('dashboard-mode');

    // Clean up existing view and chart if any
    if (this.view) {
      this.view.unmount();
    }
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    this.view = new DashboardView();
    this.view.render();
    this.view.bindEvents(this);

    // Mount navbar to dashboard container, positioned before dashboard-main
    const dashboardContainer = document.getElementById('dashboard-container');
    const dashboardMain = dashboardContainer?.querySelector('.dashboard-main');
    if (dashboardContainer && dashboardMain) {
      if (this.navbar) {
        this.navbar.destroy();
      }
      this.navbar = new NavbarPresenter();
      this.navbar.init();
      dashboardContainer.insertBefore(this.navbar.view.element, dashboardMain);
      this.navbar.view.bindScrollEvent();
    }

    // Ambil data progres, stats, dan score improvement dari model secara async
    const [progressData, userStats, scoreImprovement] = await Promise.all([
      this.model.getProgressData(),
      this.model.getUserStats(),
      this.model.getScoreImprovement()
    ]);

    // Initialize chart dengan data nyata
    this.initializeChart(progressData);
    // Tampilkan statistik user
    this.view.updateStats(userStats);

    // Atur tampilan score-improvement
    const improvementEl = document.querySelector('.score-improvement');
    if (improvementEl) {
      if (scoreImprovement && scoreImprovement.show && scoreImprovement.value > 0) {
        improvementEl.style.display = '';
        // Update angka improvement
        const valueEl = improvementEl.querySelector('.score-improvement-value');
        if (valueEl) {
          valueEl.textContent = `+${scoreImprovement.value}`;
        } else {
          improvementEl.textContent = `+${scoreImprovement.value}`;
        }
      } else {
        improvementEl.style.display = 'none';
      }
    }
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (this.view) {
      this.view.unmount();
    }
    if (this.navbar) {
      this.navbar.destroy();
    }
    // if (this.footerPresenter) {
    //   this.footerPresenter.destroy();
    //   this.footerPresenter = null;
    // }
    document.body.classList.remove('dashboard-mode');
  }

  initializeChart(progressData) {
    const progressCtx = document.getElementById('progressChart');
    if (!progressCtx) {
      console.error('Progress chart canvas not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const cssVars = getComputedStyle(document.documentElement);
    const colorPrimary = cssVars.getPropertyValue('--color-primary').trim();
    const colorPrimaryDark = cssVars.getPropertyValue('--color-primary-dark').trim();
    const colorPrimaryLight = cssVars.getPropertyValue('--color-primary-light').trim();
    const colorPrimaryShadow = cssVars.getPropertyValue('--color-primary-shadow').trim();
    const colorText = cssVars.getPropertyValue('--color-text-main').trim();
    const colorTextSecondary = cssVars.getPropertyValue('--color-text-secondary').trim();
    const colorBgGrid = cssVars.getPropertyValue('--color-slate-100').trim();
    const colorTooltipBg = cssVars.getPropertyValue('--color-slate-800').trim();
    const colorTooltipTitle = cssVars.getPropertyValue('--color-bg-card-alt').trim();
    const colorTooltipBody = cssVars.getPropertyValue('--color-bg-card-alt').trim();
    const colorTooltipBorder = cssVars.getPropertyValue('--color-text-muted').trim();

    this.chart = new Chart(progressCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['4 Minggu Lalu', '3 Minggu Lalu', '2 Minggu Lalu', 'Minggu Lalu', 'Minggu Ini'],
        datasets: [{
          label: 'Skor Aksen',
          data: Array.isArray(progressData) && progressData.length === 5 ? progressData : [75, 78, 77, 80, 82],
          backgroundColor: colorPrimaryLight,
          borderColor: colorPrimary,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colorPrimaryDark,
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
              color: colorBgGrid,
              lineWidth: 1
            },
            ticks: {
              color: colorTextSecondary,
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
              color: colorBgGrid,
              lineWidth: 1
            },
            ticks: {
              color: colorTextSecondary,
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
            backgroundColor: colorTooltipBg,
            titleColor: colorTooltipTitle,
            bodyColor: colorTooltipBody,
            borderColor: colorTooltipBorder,
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

  // loadUserStats() tidak diperlukan lagi, sudah digantikan oleh async init

  handleStartTraining() {
    console.log('Starting training...');
    // For now, just show an alert. Later this can navigate to a training module
    alert('Fitur latihan akan segera tersedia!');
  }

  handleCategorySelect(categoryId) {
    console.log('handleCategorySelect called with categoryId:', categoryId);
    
    if (!categoryId) {
      console.error('No categoryId provided');
      return;
    }
    
    const targetPath = `/categories/${categoryId}`;
    console.log('Navigating to:', targetPath);
    
    // Use the router to navigate to the category
    if (window.router && typeof window.router.navigateTo === 'function') {
      console.log('Using router.navigateTo');
      const success = window.router.navigateTo(targetPath);
      console.log('Navigation result:', success);
      
      if (!success) {
        console.warn('Router navigation failed, falling back to direct navigation');
        window.location.href = targetPath;
      }
    } else {
      console.log('Router not available, using direct navigation');
      window.location.href = targetPath;
    }
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

    if (this.navbar) {
      this.navbar.view.removeScrollEvent();
      this.navbar.destroy();
      this.navbar = null;
    }

    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
}

export default DashboardPresenter;
