// Created by Shamith Pasula, Bhavya Gupta, Kush Goswami, Archit Pimple

const ASSIGNMENT_TABLE_SELECTOR = "#container_content > div > table:nth-child(6) > tbody > tr > td.home_left > table > tbody";
const ADD_ASSIGNMENT_SELECTOR = '#container_content > div > div.content_spacing_sm';
const ASSIGNMENT_SCORES_SELECTOR = '#container_content > div.content_margin > table:nth-child(6) > tbody > tr > td.home_left > table > tbody > tr > td:nth-child(4)';
const PERCENT_GRADE_SELECTOR = "#container_content > div.content_margin > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(1) > b:nth-child(4)";
const LETTER_GRADE_SELECTOR = "#container_content > div.content_margin > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(1) > b:nth-child(2)";
const CATEGORIES_SELECTOR = "#container_content > div.content_margin > table:nth-child(6) > tbody > tr > td.home_right > div.module:eq(1) > div.module_content > table > tbody > tr:nth-child(n+2)";
const IS_WEIGHTED_SELECTOR = "#container_content > div.content_margin > table:nth-child(6) > tbody > tr > td.home_right > div.module:eq(1) > div.module_content > table > tbody > tr:nth-child(1) > td:nth-child(2)";
const IS_WEIGHTED = $(IS_WEIGHTED_SELECTOR).text() == "Weight:";
const NEW_ASSIGNMENT_SELECTOR = '#container_content > div.content_margin > table:nth-child(6) > tbody > tr > td.home_left > table > tbody > tr:nth-child(1)';
const CATEGORIES_CSS_PATH = '#container_content > div.content_margin > table:nth-child(6) > tbody > tr > td.home_right > div.module:eq(1) > div.module_content > table > tbody > tr:nth-child(n+2)';
 
var categories = {};
var categoriesNames = [];
var categoriesEarned = {};
var categoriesPoss = {};
var percentGrade = 0;
var letterGrade = "";
var finalBoolean = true;
var gradeScale = {
    "A+": 0.97,
    "A": 0.93,
    "A-": 0.9,
    "B+": 0.87,
    "B": 0.83,
    "B-": 0.8,
    "C+": 0.77,
    "C": 0.73,
    "C-": 0.7,
    "D+": 0.67,
    "D": 0.63,
    "D-": 0.6,
    "F": 0
};
var originalGrade = 0;
var percentGradeAfterFinal = 0;
var finalGradeForTarget = 0;
var numNewAssignments = 0;
var shouldBeEdited = true;
 
 
// Need to be called at this point
setCategories();
setAssignments();
getOriginalGrade();
calcGrade();
calcLetterGrade();
 
 
function setCategories(){
    if (IS_WEIGHTED) {
        $(CATEGORIES_SELECTOR).each(function () {
            var name = $(this).find("td.list_label_grey").text();
            var weight = $(this).find('td:nth-child(2)').text();
            weight = weight.substring(0, weight.length - 1);
            weight = parseFloat(weight) / 100;
            categories[name] = weight;
            categoriesEarned[name] = [];
            categoriesPoss[name] = [];
            categoriesNames.push(name);
        });
    } else {
        categoriesNames = ["---"];
        categories = {
            "---": 1
        }
        categoriesEarned["---"] = [];
        categoriesPoss["---"] = [];
    }
}
 
 
var final = `
<tr id = "final">
 
<td>
    <text id = "finalText">Final</text>
</td>
 
<td style="width:100%;"> Weight : <br>
    <input type = "final_weight" placeholder = "20" maxlength = "3" name = 'final_weight' id = "final_weight" style="width: 50px"></input> %
</td>
 
<td>
    ${getDate()}
<br>
</td>
<td nowrap="">
    <div>
        Score:
 
    </div>
    <div> <input type="number" id="final_user_score" placeholder="90" maxlength="5" class="userscores" min="0"> </input> 
        / 
    <input type="number" id="final_max_score" placeholder="100" maxlength="5" class="userscores" min="0"> </input> </div> 
    
</td>
    
<td>
</td> 
 
</tr> `;
 
var name1 = `
<tr>
 
<td>
    <div class="float_l padding_r5" style="min-width: 105px;"> </div>
 
    <select id="assignment_categories">
        ${getOptions()}
    </select>
    
    <br> 
        <input type="text" id="assignment" placeholder="Assignment Name"> </input>
    </div>
</td>
 
<td style="width:100%;"> </td>
 
<td>
    ${getDate()}
<br>
</td>
<td nowrap="">
    <div>
        Score:
 
    </div>
    <div> <input type="number" name="user_score" placeholder="90" maxlength="5" class="userscores" min="0"> </input> 
        / 
    <input type="number" name="max_score" placeholder="100" maxlength="5" class="userscores" min="0"> </input> </div> 
    
</td>
 
<td class="list_text">
    <div style="width: 125px;"> </div>
</td> 
 
</tr> `;
var name2 = `
<tr class = "highlight">
 
<td>
    <div class="float_l padding_r5" style="min-width: 105px;"> </div>
 
    <select id="assignment_categories">
        ${getOptions()}
    </select>
    
    <br> 
        <input type="text" id="assignment" placeholder="Assignment Name"> </input>
    </div>
</td>
 
<td style="width:100%;"> </td>
 
<td>
    ${getDate()}
<br>
</td>
<td nowrap="">
    <div>
        Score:
 
    </div>
    <div> <input type="number" name="user_score" placeholder="90" maxlength="5" class="userscores" min="0"> </input> 
        / 
    <input type="number" name="max_score" placeholder="100" maxlength="5" class="userscores" min="0"> </input> </div> 
    
</td>
 
    <div style="width: 125px;"> </div>
 
 
</tr> `;
 
function getOptions() {
    var result = "";
    for (var i = 0; i < categoriesNames.length; i++) {
        result += "<option value = " + categoriesNames[i] + ">" + categoriesNames[i] + "</option>\n";
    }
    return result;
}
 
function getDate()
{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yy = today.getFullYear().toString().substring(2, 4);
 
    today = mm + '/' + dd + '/' + yy;
    return today;
}
 
function setAssignments(){
    $(ASSIGNMENT_TABLE_SELECTOR +' > tr').not('#menu_assignment').each(function(){
        var assignmentText = $(this).find('td:nth-child(4)').text();
        var earnedPts = getEarnedPts(assignmentText);
        var possPts = getPossPts(assignmentText);
        // var percent = $(assignmentCell).find('form > div.assignment_percent');
        
        var category = $(this).find('td:nth-child(1) > div > form > select').val();
        
        if(typeof category == 'undefined'){
            var categoryText = $(this).find('td:nth-child(1) > div').contents().get(0);
            if(typeof categoryText != 'undefined'){
                category = categoryText.nodeValue.trim();
            } else {
                category = categoriesNames[0];
            }
        }
        // percent.text(((earnedPts/possPts) * 100).toFixed(2) + "%");
        if (categoriesNames.indexOf(category) != -1){
            earnedPts = parseFloat(earnedPts);
            possPts = parseFloat(possPts);
            if(isNaN(possPts)){
                possPts = 0;
            }
            if(isNaN(earnedPts)){
                earnedPts = 0;
            }
            categoriesEarned[category].push(earnedPts);
            categoriesPoss[category].push(possPts);
        }
    });
}
 
function setGradeScale(){
    $(GRADE_SCALE_SELECTOR +' > tr').not('#menu_assignment').each(function(){
        for (var i = 1; i <= 2; i++){
            var text = $(this).find('td:nth-child(' + i + ")").text().trim();
            if (typeof text != "undefined"){
                var equalsIndex = text.indexOf("=");
                var percentIndex = text.indexOf("%");
                var letter = text.substring(0, equalsIndex - 1);
                var percent = text.substring(equalsIndex + 2, percentIndex).val()/100;
                gradeScale[letter] = percent;
            }
        }
    })
}
 
function getOriginalGrade(){
    var grade = $(PERCENT_GRADE_SELECTOR).text().trim();
    if (typeof grade != "undefined"){
        var percentIndex = grade.indexOf("%");
        originalGrade = parseFloat(grade.substring(0, percentIndex))/100;
    }
}
 
function calcGrade(){
    var categoriesAvgs = {};
    for (cat in categoriesEarned){
        categoriesAvgs[cat] = sum(categoriesEarned[cat])/sum(categoriesPoss[cat]);
    }
    var scoreSum = 0;
    var weightSum = 0;
    for (cat in categoriesAvgs){
        if (!isNaN(categoriesAvgs[cat])){
            scoreSum += categoriesAvgs[cat]*categories[cat];
            weightSum += categories[cat];
        }
    }
    percentGrade = scoreSum / weightSum;
}
 
function addAssignment(category, earnedPts, possPts){
    categoriesEarned[category].push(earnedPts);
    categoriesPoss[category].push(possPts);
}
 
function removeAssignment(category, index){
    for (var i = index; i < categoriesEarned.length - 1; i++){
        categoriesEarned[category][i] = categoriesEarned[category][i+1];
    }
    categoriesEarned[category].pop();
    for (var i = index; i < categoriesPoss.length - 1; i++){
        categoriesPoss[category][i] = categoriesPoss[category][i+1];
    }
    categoriesPoss[category].pop();
}
 
function sum(array){
    var sum = 0;
    for (var i = 0; i < array.length; i++){
        if (!isNaN(array[i])){
            sum += array[i];
        }
    }
    return sum;
}
 
function getEarnedPts(text){
    text = text.trim();
    spaceIdx = text.indexOf("\n");
    text = text.substring(spaceIdx).trim();
    var slashIdx = text.indexOf("/");
    return parseFloat(text.substring(0, slashIdx - 1).trim());
}
 
function getPossPts(text){
    text = text.trim();
    var slashIdx = text.indexOf("/");
    var equalsIdx = text.indexOf("=");
    return parseFloat(text.substring(slashIdx + 2, equalsIdx - 1).trim());
}
 
function calcGradeAfterFinal(weight, earnedPts, possPts){
    percentGrade = (1 - weight)*percentGrade + weight*(earnedPts/possPts);
}
 
function calcFinalForGrade(weight, target){
    finalGradeForTarget = (target - (1 - weight)*percentGrade)/weight;
}
 
function calcLetterGrade(){
    if (percentGrade >= gradeScale["F"]){
        letterGrade = "F";
    }
    if (percentGrade >= gradeScale["D-"]){
        letterGrade = "D-";
    }
    if (percentGrade >= gradeScale["D"]){
        letterGrade = "D";
    }
    if (percentGrade >= gradeScale["D+"]){
        letterGrade = "D+";
    }
    if (percentGrade >= gradeScale["C-"]){
        letterGrade = "C-";
    }
    if (percentGrade >= gradeScale["C"]){
        letterGrade = "C";
    }
    if (percentGrade >= gradeScale["C+"]){
        letterGrade = "C+";
    }
    if (percentGrade >= gradeScale["B-"]){
        letterGrade = "B-";
    }
    if (percentGrade >= gradeScale["B"]){
        letterGrade = "B";
    }
    if (percentGrade >= gradeScale["B+"]){
        letterGrade = "B+";
    }
    if (percentGrade >= gradeScale["A-"]){
        letterGrade = "A-";
    }
    if (percentGrade >= gradeScale["A"]){
        letterGrade = "A";
    }
    if (percentGrade >= gradeScale["A+"]){
        letterGrade = "A+";
    }
}
 
function createAddAssignmentButton(location) {
    var addAssignmentButton = $('<input/>', {
        type: 'button',
        id: 'add_assignment',
        value: 'Add Assignment',
        width: '116px',
        height: '28.8px',
    });
    addAssignmentButton.css('float', 'left');
    $(location).prepend(addAssignmentButton);
}
 
 
function createFinalCalculatorButton(location){
    var addFinalCalculator = $('<input/>', { type: 'button',
                                                id: 'final_calculator',
                                                value: 'Final Calculator',
                                                width: '116px',
                                                height: '28.8px',
                                            });
    addFinalCalculator.css('float', 'left');
    $(location).prepend(addFinalCalculator);
}
 
function createEditableAssignments(path) {
    var originalScores = getOriginalScores(path);
    var userScore = originalScores[0];
    var maxScore = originalScores[1];
    if (shouldBeEdited){
        
        $(path).append('\
            <form>\
            <input type="number" name="user_score" style="width: 50px;" min="0"> /\
            <input type="number" name="max_score" style="width: 50px;" min="0"> \
            <div class="userscores"> </div>\
            </form>'
        );
        $(path).prepend(`<b>Original:</b>`);
    }
    $(path).find('input[name="user_score"]').val(parseFloat(userScore));
 
 
    $(path).find('input[name="max_score"]').val(parseFloat(maxScore));
 
}
 
function getOriginalScores(path)
{
    path = $(path).text();
    if(path == null){
        return ["0", "0"];
    }
 
    var grade1 = path.match(/([0-9]|[" "]|[.])+((\/))/g);
    if(grade1 == null){
        return ["0", "0"];
    }
    grade1 = grade1[0];
    var actual = grade1.substring(0, grade1.length-2);
 
    var grade2 = path.match(/((\/))+([0-9]|[" "]|[.])*/g);
    grade2 = grade2[0];
    var max = grade2.substring(2, grade2.length-1);
 
    return [actual, max];
}
 
function updateAssignments(){
    $(ASSIGNMENT_TABLE_SELECTOR +' > tr').each(function(){
        var earnedPts = $(this).find("td:nth-child(4) > form > input[type=number]:nth-child(1)").val();
        var possPts = $(this).find("td:nth-child(4) > form > input[type=number]:nth-child(2)").val();
        var category = $(this).find("td:nth-child(1) > select").val();
        
        if (typeof category == "undefined"){
            category = $(this).find('td:nth-child(1) > div').contents().get(0);
            if (typeof category != "undefined"){
                category = category.nodeValue.trim();
            }
        }
        if (typeof earnedPts == "undefined"){
            earnedPts = $(this).find("input[name='user_score']").val();
        }
        if (typeof possPts == "undefined"){
            possPts = $(this).find("input[name='max_score']").val();
        }
        
        if (categoriesNames.indexOf(category) != -1){
            earnedPts = parseFloat(earnedPts);
            possPts = parseFloat(possPts);
            if(isNaN(possPts)){
                possPts = 0;
            }
            if(isNaN(earnedPts)){
                earnedPts = 0;
            }
            categoriesEarned[category].push(earnedPts);
            categoriesPoss[category].push(possPts);
        }
    });
}
function finalC(){
    if (!finalBoolean){
        var actual = parseFloat(document.getElementById("final_user_score").value);
        var max = parseFloat(document.getElementById("final_max_score").value);
        var weight = parseFloat(document.getElementById("final_weight").value);
 
        calcGradeAfterFinal(weight/100, actual, max);
    }
}
//////////////////
createFinalCalculatorButton(ADD_ASSIGNMENT_SELECTOR);
createAddAssignmentButton(ADD_ASSIGNMENT_SELECTOR);
$(ASSIGNMENT_SCORES_SELECTOR).each(function() {
    createEditableAssignments($(this));
});
shouldBeEdited = !shouldBeEdited;
 
document.getElementById("add_assignment").onclick = (event) => {
  
   if (numNewAssignments % 2 == 0){
        $(name1).insertBefore(NEW_ASSIGNMENT_SELECTOR);
   }else {
        $(name2).insertBefore(NEW_ASSIGNMENT_SELECTOR);
   }
   numNewAssignments++;
   
}
 
document.getElementById("final_calculator").onclick = (event) => {
    if(finalBoolean){
            $(final).insertBefore(NEW_ASSIGNMENT_SELECTOR);
            finalBoolean = false;
    }
 
 }
 
document.onchange = (event) => {
    setCategories();
    updateAssignments();
    calcGrade();
    finalC();
    calcLetterGrade();
    $(PERCENT_GRADE_SELECTOR).text((percentGrade*100).toFixed(2) + "%");
    $(LETTER_GRADE_SELECTOR).text(letterGrade);   
}
