
//BUDGET CONTROLLER - Object
var budgetController = (function(){

    // Constructor function
    var Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;

    };
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    // Data structure to store Expense and Income
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage : -1
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(currentElement) {
            sum += currentElement.value;
        });

        data.totals[type] = sum;
    };
    // instead of 
    // var allExpenses = [];
    // var allIncomes = [];
    // var totalExpenses = [];

    return {
        addItem: function(type, desc, val) {
            var newItem, ID;
            
            // Create new Id
            // ID = last ID + 1 ( bigest ID of arr + 1)
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
               
            } else {
                ID = 0;
            }

            // Create new Item base on 'exp' or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val);
               
            } else {
                newItem = new Income(ID, desc, val);                
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },
        deleteItem: function(type, id) {
            var index = -1;
            for (var i = 0; i < data.allItems[type].length; i++) {
                if (data.allItems[type][i].id == id) {
                
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                data.allItems[type].splice(index, 1);       // Delete 1 element from index 

            }
        },

        calculateBudget : function() {

            // Calc total income and expense 
            calculateTotal('exp');
            calculateTotal('inc');


            // Calc budget = income - expense 
            data.budget = data.totals.inc - data.totals.exp;

            // Calc the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            

        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(el => {
                el.calcPercentage(data.totals.inc);
            });


        }, 

        getPercentages: function() {

            // Return a array of percentage 
            var allPerc = data.allItems.exp.map(function (curr) {
                return curr.getPercentage();
              });

            return allPerc;
        },

        // Get Budget 
        getBudget: function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
            console.getPercentages();
           
        }
    };
})();

//UI CONTROLLER - Object
var UIController = (function(){

    // DOM strings for get element
    var DOMstrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container: '.container',
        expensePercentLabel: '.item__percentage',
        titleTime: '.budget__title--month'
    };

    var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // Return a object stored method for control UI
    return {
        getInput: function() {
            // Return a object
            return {
                type : document.querySelector(DOMstrings.inputType).value,      // Will be either inc or exp 
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value),

            };
            
        },

        addNewItem : function(obj, type) {

            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', this.formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearInputField: function() {
            var fields;
            //Get all element match , return element array 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // Convert list to array
            // var fieldArr = Array.prototype.slice.call(fields);
            
            // Set value for element
            fields.forEach(element => {
                element.value = "";
            });

            // Focus description
            fields[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
        },
        
        displayBudget: function(obj) {
            // insertAdjacentHTMLeforeconsole.log(obj);
            document.querySelector(DOMstrings.budgetLabel).textContent = this.formatNumber(obj.budget,'inc');
            document.querySelector(DOMstrings.incomeLabel).textContent = this.formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = this.formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent =  "---";
  
            }
        },

        displayPercentage: function(percentages) {
            
            // Get node list 
            var fields = document.querySelectorAll(DOMstrings.expensePercentLabel);

            // Change percentage for all item node(Call back method for all item) 
            // var nodeListForEach = function(list, callback){
            //     for (var i = 0; i < list.length; i++) {
            //         callback(list[i], i);
            //     }
            // };
            nodeListForEach(fields, function (currentNode, index) {
                if (percentages[index] > 0) {
                    currentNode.textContent = percentages[index] + '%';
                } else {
                    currentNode.textContent = '---';
                }
            });
        }, 

        deleteListItem: function(id) {
            document.querySelector('#' + id).remove();
        }, 

        formatNumber: function(num, type) {
            /*
            + or - before number
            exactly 2 decimal points
            comma separation the thousands 
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */
           var  int, dot, sign;
           num = Math.abs(num);
           num = num.toFixed(2);    // return string : lam tron 2 chu so thap phan
            
           splitNum = num.split('.');       // ['12345', '67']
           int = splitNum[0];       // '12345'    
           dot = splitNum[1];
           if (int.length > 3) {
            int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
           }
           
           sign = (type === 'inc') ? '+' : '-';

           return sign + ' ' + int + '.' + dot;

        },
        displayMonth: function() {
            var now, date, month, year;
           
            now = new Date();
            date = now.getDate();
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.titleTime).textContent = date + '/' + month + '/' + year;
        },

        changeType: function() {
            var allInputNode = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(allInputNode, function(curr){
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        }
    };

})(); 

// GLOBAL APP CONTROLLER - Object
var controller = (function(budgetCtr, UICtr) {

    // Set event for all button
    var setupEventListener = function() {
        var DOM = UICtr.getDOMstrings();

        // Click event
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrAddItem);

        // Enter event
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13) {
                ctrAddItem();
            }
        });

        // Event when click delete button - EVENT DELEGATOR (Event bubbling)
        document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtr.changeType);
        
 
    };
    
    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtr.calculateBudget();

        // 2. Return the budget 
        var budget = budgetCtr.getBudget();

        // 3.Display the budget on the UI
        UICtr.displayBudget(budget);


    };

    var updatePercentage = function() {
        // 1. Calculate the percent
        budgetCtr.calculatePercentages();

        // 2. Read percentages from the budget controller
        var listPerc = budgetCtr.getPercentages();

        // 3. Update the UI with the new percent
        UICtr.displayPercentage(listPerc);
    };

    // Control add new item
    var ctrAddItem = function () {
        var input ,newItem;

        // 1. Get the filed input data
        input = UICtr.getInput();

        // Check fields 
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtr.addItem(input.type, input.description, input.value);
            

            // 3. Add the item to the UI
            UICtr.addNewItem(newItem, input.type);

            // 4. Clear fields
            UICtr.clearInputField();

            // 5. Calculate and update the budget
            updateBudget();

            updatePercentage();
        }
  
    };

    var ctrDeleteItem = function(event) {
        
        var elementTarget, idItem, fieldsID, type, id;

        // Get id of element will be delete
        // event.target return a element clicked >< event.currentTarget (always '.container'))
        elementTarget =  event.target.parentNode.parentNode.parentNode.parentNode;
        idItem = elementTarget.id;       // return inc-0

        fields = idItem.split('-');            // split to array
        type = fields[0];
        id = fields[1];
    
        // Delete data in budgetControl
        budgetCtr.deleteItem(type, id);

        // Delete item in UI
        UICtr.deleteListItem(idItem);

        // Update budget (Calc + display)
        updateBudget();

        updatePercentage();

    };

    // Add event for click and keypress Enter 
    
    return  {
        init: function (){
            console.log('Application started');
            setupEventListener();
            UICtr.displayMonth();
            
            //Display all zero
            UICtr.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage: 0   
            });
        }

    };

})(budgetController, UIController);


// Start Programming
controller.init();

