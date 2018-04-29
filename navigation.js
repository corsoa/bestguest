$(document).on('ready', (() => {
  const generateFakeName = ((customer) => {
    const initialMap = {
      A: ['Aaron', 'Aimee', 'Amanda', 'Alexander'],
      B: ['Bernard', 'Barbara', 'Brittany', 'Beth'],
      C: ['Chrstina', 'Cathy', 'Christopher'],
      D: ['David', 'Deborah'],
      E: ['Ernie', 'Edith'],
      F: ['Frances', 'Frank'],
      G: ['Gerry'],
      H: ['Harold', 'Harry'],
      I: ['Irene'],
      J: ['Jeff', 'John'],
      K: ['Keith', 'Kristen'],
      L: ['Lorraine'],
      M: ['Maria'],
      N: ['Nate'],
      O: ['Oprah'],
      P: ['Perry'],
      Q: ['Quinn'],
      R: ['Roger'],
      S: ['Stacey', 'Stephen'],
      T: ['Trevor'],
      U: ['Utarr'],
      V: ['Vishnu'],
      W: ['Winston'],
      X: ['Xavier'],
      Y: ['Yvyonne'],
      Z: ['Zack']
    };
    const getRandomName = ((initial) => {
      return initialMap[initial][Math.floor(Math.random()*initialMap[initial].length)];
    });
    return `${getRandomName(customer.FirstInitial)} ${customer.LastName}`;
  });
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
  $.getJSON('customer_profile.json', ((customerProfileData) => {

  
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
          FirstInitial: row.FirstInitial,
          LastName: row.LastName,
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
      cname: generateFakeName(customerHash[customer]),
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
  });
  const getRandomCustomer = (() => {
    return topCustomerData[Math.floor(Math.random()*topCustomerData.length)];
  });
  const buildRandomNotes = (() => {
    const allNotes = ['Likes salsa music', 'Comes in every Tuesday', 'Diet coke, no ice', 'Vegetarian', 'Refers lots of business to us'];
    return `<ul><li>${allNotes[Math.floor(Math.random() * allNotes.length)]}</li>
    <li>${allNotes[Math.floor(Math.random() * allNotes.length)]}</li></ul>`;
  });
  const buildPaymentProfileView = ((max) => {
    const getRandomAnonCard = (() => {
      return `XXXX${Math.floor(Math.random() * 9999) + 1}`;
    });
    if (!max) {
      max = 1;
    }
    let builtProfileView = '';
    // use the received API (sample) data.
    customerProfileData.profile.paymentProfiles.forEach((paymentProfile) => {
      //only get one payment method from sample data.
      const creditCard = paymentProfile.payment.creditCard;
      for (let i = 0; i < max; i++) {
        if (i > 0) {
          creditCard.cardNumber = getRandomAnonCard()
        }
        builtProfileView += `<li class="mdc-list-item">${creditCard.cardNumber}
        <span class="mdc-list-item__meta card-type-${creditCard.cardType}">
        </span>
        </li>`;
      }
    });
    return builtProfileView;
  });
  window.navPage = ((pageId, newCustomer) => {
    if (!pageId) {
      $('#intro-card').show();
      $('#regular-customer-card').hide();
      $('#top-customer-report-card').hide();
    }
    else {
      if (pageId === 'regular-customer') {
        // put some data in.
        const randomCustomer = getRandomCustomer();
        $('#customer-data-name').html(randomCustomer.cname);
        $('#customer-data-is-frequent-flier').html('-');
        $('#customer-data-is-big-fish').html('-');
        $('#customer-data-notes').html('');
        if (!newCustomer) {
          // EXISTING CUSTOMER
          $('#customer-data-is-frequent-flier').html('<i class="material-icons">airplanemode_active</i>');
          if (randomCustomer.isFrequentFlyer) {
            
          }
          if (randomCustomer.isBigFish) {
            $('#customer-data-is-big-fish').html('<i class="material-icons">card_travel</i>');
          }
          if (randomCustomer.visits > 3) {
            $('#customer-data-notes').html(buildRandomNotes());
          }
          $('#payment-profile-list').html(buildPaymentProfileView(3));
        }
        else {
          // NEW CUSTOMER
          // on intro card, pulsate the div
          (function pulse(){
            $('#new-customer-sub-card').delay(200).fadeOut('slow').fadeIn();
          })();
          // fade in the notice that a new profile created.
          $('#payment-profile-list').html(buildPaymentProfileView(1));
        }
      }
      else {
        $('#regular-customer-card').hide();
      }
      $('#' + pageId + '-card').show();
      $('#intro-card').delay(500).slideUp();
    }
  });
  navPage();
 }));
 $(document).keypress((e) => {
  if (e.which === 49) {
    navPage('regular-customer');
  }
  else if (e.which === 50) {
    navPage('regular-customer', true);
  }
  else if (e.which === 51) {
    navPage('top-customer-report');
  }
  else if (e.which === 52) {
    navPage();
  }
 });
}));
}));
