// AureaVoice Platform JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    
    const brandColors = {
        brightBlue: '#0079FF',
        deepBlue: '#004AAD',
    };

    new Chart(progressCtx, {
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
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    ticks: {
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
                    callbacks: {
                        title: function(tooltipItems) {
                            const item = tooltipItems[0];
                            let label = item.chart.data.labels[item.dataIndex];
                            return Array.isArray(label) ? label.join(' ') : label;
                        }
                    }
                }
            }
        }
    });
});
