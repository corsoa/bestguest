$(document).on('ready', (() => {
  /*
  const topCustomerData = [
    {
      cname: 'Bob Fisher',
      visits: 5,
      avgSpend: 41.04,
      score: 9.2
    },
    {
      cname: 'Rachel Bard',
      visits: 2,
      avgSpend: 69.02,
      score: 8.1
    }
  ]
  */
 $.getJSON('raw_data.json', ((data) => {
  const topCustomerData = [];
  //do some preprocessing
  const customerHash = {};
 
  let totalSpendAllCustomers = 0;
  
  const totalVisitsAllCustomers = data.length;
  data.forEach((row) => {
    // figure out how many times we saw each customer.
    totalSpendAllCustomers += row.Amount;
    if (row.Amount > 0) {
      if (!customerHash[row.FirstInitial + row.LastName]) {
        customerHash[row.FirstInitial + row.LastName] = {
          cname: row.FirstInitial + ' ' + row.LastName,
          totalSpend: row.Amount,
          visits: 1
        }
      }
      else {
        customerHash[row.FirstInitial + row.LastName].totalSpend += row.Amount;
        customerHash[row.FirstInitial + row.LastName].visits += 1;
      }
    }
  });
  const numUniqueCustomers = Object.keys(customerHash).length;
  const calculateScore = ((customer) => {
    let score = 1;
    if (customer.visits >= 2) {
      score +=3;
    }
    if (customer.totalSpend > avgSpendPerCustomer) {
      score += (customer.totalSpend / avgSpendPerCustomer) * 1.2;
    }
    if (customer.visits > avgVisitsPerCustomer) {
      score += (customer.visits / avgVisitsPerCustomer * 1.2);
    }
    return Math.round(score);
  });
  const isBigFish = ((customer) => {
    if (customer.totalSpend > avgSpendPerCustomer) {
      return true;
    }
    return false;
  });
  const isFrequentFlyer = ((customer) => {
    if (customer.visits > avgVisitsPerCustomer) {
      return true;
    }
    return false;
  });
  
  const avgSpendPerCustomer = (totalSpendAllCustomers / numUniqueCustomers);
  const avgVisitsPerCustomer = (totalVisitsAllCustomers / numUniqueCustomers);

  for (var customer in customerHash) {
    topCustomerData.push({
      cname: customerHash[customer].cname,
      visits: customerHash[customer].visits,
      avgSpend: (customerHash[customer].totalSpend / customerHash[customer].visits).toFixed(2),
      totalSpend: (customerHash[customer].totalSpend).toFixed(2),
      isBigFish: isBigFish(customerHash[customer]),
      isFrequentFlyer: isFrequentFlyer(customerHash[customer]),
      score: calculateScore(customerHash[customer])
    });
  }
  

  $('#top-customer-datatable').dataTable({
    data: topCustomerData,
    columns: [
      { data: 'cname' },
      { data: 'visits'},
      { data: 'avgSpend', type: 'currency' },
      { data: 'totalSpend', type: 'currency' },
      { data: 'isFrequentFlyer' },
      { data: 'isBigFish' },
      { data: 'score', name: 'Score' }
    ],
    order: [[6, 'desc']],
    columnDefs: [
      {
        type: 'currency',
        targets: 2
      },
      {
        type: 'currency',
        targets: 3
      },
      {
        render: ((data, type, row) => {
          if (data) {
            return '<i class="material-icons">airplanemode_active</i>'
          }
          return '-';
        }),
        targets: 4
      },
      {
        render: ((data, type, row) => {
          if (data) {
            return '<i class="material-icons">card_travel</i>'
          }
          return '-';
        }),
        targets: 5
      },
      {
        render: ((data, type, row) => {
          if (data >= 10) {
            return '<i class="material-icons">grade</i>'
          }
          return data;
        }),
        targets: 6
      }
    ]
  })
 }));
 
  
  
  window.navPage = ((pageId) => {
    $('#regular-customer-card').hide();
    $('#top-customer-report-card').hide();
    "8422",
    "8422",
    $('#intro-card').hide();

    if (!pageId) {
      $('#intro-card').show();
    }
    else {
      $('#' + pageId + '-card').show();
    }
  });
  navPage();
}));
