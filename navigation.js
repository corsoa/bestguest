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
  data.forEach((row) => {
    // figure out how many times we saw each customer.
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
  });
  const calculateScore = ((customer) => {
    if (customer.visits >= 2) {
      return 1;
    }
    return 0;
  })
  for (var customer in customerHash) {
    topCustomerData.push({
      cname: customerHash[customer].cname,
      visits: customerHash[customer].visits,
      avgSpend: ( Math.round(customerHash[customer].totalSpend / customerHash[customer].visits, 2)),
      totalSpend: customerHash[customer].totalSpend,
      score: calculateScore(customerHash[customer])
    });
  }

  $('#top-customer-datatable').dataTable({
    data: topCustomerData,
    columns: [
      { data: 'cname', name: 'Customer Name' },
      { data: 'visits', name:'Visits last 30 days' },
      { data: 'avgSpend', name: 'Average spent per visit' },
      { data: 'totalSpend', name: 'Total Spent'},
      { data: 'score', name: 'Big Fish Score' }
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
