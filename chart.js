const ctx = document.getElementById('weekChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    datasets: [{
      label: 'Hours',
      data: [1,2,1,3,2,4,1],
      backgroundColor: '#3b82f6'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
});
