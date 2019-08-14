import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Navbar, Nav
} from "reactstrap";

export default class RuleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ruleActiveItem: this.props.ruleActiveItem,
      campaigns: this.props.campaigns,
      propertiesList: [{text:'lastVisit',type:'date'},{text:'isActive',type:'bool'},{text:'lastActiveDate',type:'date'},
                       {text:'minNumberOfVisitsPerWeek',type:'integer'},{text:'maxNumberOfVisitsPerWeek',type:'integer'},
                       {text:'numberOfVisitsDuringCurrentMonth',type:'integer'},{text:'averageNumberOfVisitsPerMonth',type:'integer'}],
       propertiesListText: ['lastvisit','isactive','lastactivedate','minnumberofvisitsperweek','maxnumberofvisitsperweek',
                            'numberofvisitsduringcurrentmonth','averagenumberofvisitspermonth'],
      arithmaticOperators : ['=','>=', '<=','>','<'],
      logicalOperators : ['And','Or','Not'],
      dropdownOpen: false,
      ruleParts:this.props.ruleActiveItem.description,
      startDate: new Date(),
    showInput: true,
    error: "",
    showRuleState: false,
    campaignId:this.props.campaign
    };
  }
  
  createPropertiesDropDown = () => {
    let propertiesDropDown = []
    // Outer loop to create parent
    for (let i = 0; i < this.state.propertiesList.length; i++) {
      propertiesDropDown.push(<DropdownItem key={i} onClick={this.onDropdownItem_Click}>{this.state.propertiesList[i].text}</DropdownItem>)
    }
    return propertiesDropDown
  }
  createLogicalOperatorsDropDown = () => {
    let propertiesDropDown = []
    // Outer loop to create parent
    for (let i = 0; i < this.state.logicalOperators.length; i++) {
      propertiesDropDown.push(<DropdownItem key={i} onClick={this.onDropdownItem_Click}>{this.state.logicalOperators[i]}</DropdownItem>)
    }
    return propertiesDropDown
  }

  createCampaignsDropDown = () => {
    let propertiesDropDown = []
    // Outer loop to create parent
    for (let i = 0; i < this.state.campaigns.length; i++) {
      propertiesDropDown.push(<DropdownItem key={i} onClick={this.onDropdownItem_Click}>{this.state.campaigns[i].name}</DropdownItem>)
    }
    return propertiesDropDown
  }

  onChange = (date) => {
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!
    
    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    var strDate = dd + '/' + mm + '/' + yyyy;
    this.setState({ ruleParts: this.state.ruleParts +' '+ strDate});
  }
  validateRule = (ruleParts, isMainStatement) => {
    this.setState({showRuleState : true});
     var lowerCaseRule = ruleParts.toLowerCase();
     if(isMainStatement && (!lowerCaseRule.includes("if") || !lowerCaseRule.includes("then"))){
        this.setState({error : "Rule must Contain atleast one condition starting with if & one then statement."});
        return false;
     }
    var splitedRule = lowerCaseRule.split(" ");
    splitedRule = this.adjustRule(splitedRule);
    
    if(!this.checkValidBrackets(splitedRule)){
        this.setState({error : "Please make sure all brackets are closed properly."});
        return false;
    }
    var count=0;
    for(var i=0;i<splitedRule.length;i++){
      count ++;
        if(splitedRule[i] === 'if')
           continue;
        
        else if(splitedRule[i] === 'then'){
             var campaignName = splitedRule.slice(i+1,splitedRule.length).join(' ');
             if(!this.isValidCampaignName(campaignName)){
                this.setState({error : "Invalid campaign name"});
                 return false;
             }
             else{
                 break;
             }
           }
        else if(splitedRule[i] === '('){
          var sentenceEndIndex = this.getFullSentenceWithBrackets(splitedRule,i);
          var internalSentence = splitedRule.slice(i+1,sentenceEndIndex).join(' ');
          var isValid = this.validateRule(internalSentence);
          if(!isValid)
            return false;
          i=sentenceEndIndex;
        }
        else if(i === splitedRule.length-1 && (this.state.logicalOperators.includes(splitedRule[i]) || this.state.arithmaticOperators.includes(splitedRule[i]))){
            this.setState({error : "Sentence can't be ended by an operator"});
            return false;
        }
        else if(splitedRule[i] === 'not'){
            i++;
            if(this.state.propertiesListText.includes(splitedRule[i])){
                var propertyType = this.getItemType(splitedRule[i]);
                if(propertyType !== 'bool'){
                    this.setState({error : "Not must be followed by a boolean property"});
                    return false;
                }
            }
            else{
                this.setState({error : "Not must be followed by a boolean property"});
                return false;
            }
        }
        else{
           if(this.state.propertiesListText.includes(splitedRule[i])){
                propertyType = this.getItemType(splitedRule[i]);
                if(propertyType === 'integer' || propertyType === 'date'){
                    i++;
                    if(!this.state.arithmaticOperators.includes(splitedRule[i])){
                        this.setState({error : "Integer and date properties must be followen by >= <= = >  or <"});
                        return false;
                    }
                    i++;
                    if(propertyType === 'iteger' && isNaN(splitedRule[i])){
                        this.setState({error : "Integer properties must be compared to integer value"});
                        return false;
                    }
                    if(propertyType === 'date' && !splitedRule[i].includes('/')){
                        this.setState({error : "Date properties must be compared to date value"});
                        return false;
                    }
                }
                else if(propertyType === 'bool'){
                    if(splitedRule[i+1] !== 'and' && splitedRule[i+1]!== 'or' && splitedRule[i+1]!== 'then'){
                        this.setState({error : "Bool properties Can't be compared to a value"});
                        return false;
                    }
                }
           }
        }
    }
    if(count < 3){
      this.setState({error : "Rule must have atleast one condition"});
      return false;
    }
    this.setState({error : ""});
    this.state.ruleActiveItem.description = this.state.ruleParts;
    this.state.ruleActiveItem.campaign = this.state.campaignId;
    return true;
}

checkValidBrackets = (splitedRule) => {
  var bracketsQueue = [];
  for(var i=0;i<splitedRule.length;i++){
        if(splitedRule[i] === '('){
            bracketsQueue.push('(');
        }
        else if(splitedRule[i] === ')'){
            bracketsQueue.pop();
        }
    }
    if(bracketsQueue.length > 0)
       return false;
    
    return true;
}

getFullSentenceWithBrackets = (splitedRule,startIndex) => {
   var bracketQueue =[];
   for(var i=startIndex;i<splitedRule.length;i++){
       if(splitedRule[i] === '('){
        bracketQueue.push('(');
       }
       if(splitedRule[i] === ')'){
          bracketQueue.pop();
          if(bracketQueue.length === 0)
             return i;
       }
   }
}

getItemType = (propertyName) => {
    for(var i=0;i<this.state.propertiesList.length;i++){
        if(this.state.propertiesList[i].text.toLowerCase() === propertyName){
            return this.state.propertiesList[i].type;
        }
    }
  }
  
  
isValidCampaignName = (campaignName) => {
    for(var i=0;i<this.state.campaigns.length;i++){
        if(this.state.campaigns[i].name.toLowerCase() === campaignName){
            this.state.campaignId = this.state.campaigns[i].id;
            return true;
        }
    }
    return false;
  }
  

  createArithmeticOperatorsDropDown = () => {
    let propertiesDropDown = []
    for (let i = 0; i < this.state.arithmaticOperators.length; i++) {
      propertiesDropDown.push(<DropdownItem key={i} onClick={this.onDropdownItem_Click}>{this.state.arithmaticOperators[i]}</DropdownItem>)
    }
    for (let i = 0; i < this.state.logicalOperators.length; i++) {
        propertiesDropDown.push(<DropdownItem key={this.state.arithmaticOperators.length+i} onClick={this.onDropdownItem_Click}>{this.state.logicalOperators[i]}</DropdownItem>)
      }
    return propertiesDropDown
  }

 
  onDropdownItem_Click = (e) => {
      this.setState({ ruleParts: this.state.ruleParts +' '+ e.currentTarget.textContent });
  }

  handleChange = (e) => {
    this.setState({ ruleParts: e.target.value });
}

onAddOpenBracket = () => {
    this.setState({ruleParts: this.state.ruleParts +' (' });
}

onAddClosingBracket = (e) => {
    this.setState({ruleParts: this.state.ruleParts +' )' });
}

adjustRule = (rule) =>{
    for(var i=0;i<rule.length;i++){
        if(rule[i] === ""){
            rule.splice(i,1);
        }
        if(rule[i] !== '(' && rule[i].includes('(')){
            var bracketSplit = rule[i].split('(');
            rule.splice(i,1);
            var index = i;
            for(var j=0;j<bracketSplit.length;j++){
                if(bracketSplit[j] === '')
                 rule.splice(index,0,'(')
                else
                    rule.splice(index,0,bracketSplit[j])
               
                 index++;
            }
        }
        if(rule[i] !== ')' && rule[i].includes(')')){
            bracketSplit = rule[i].split(')');
            rule.splice(i,1);
            index = i;
            for(var j=0;j<bracketSplit.length;j++){
                if(bracketSplit[j] === '')
                    rule.splice(index,0,')')
                else
                    rule.splice(index,0,bracketSplit[j])
                 index++;
            }
        }
    }
    return rule;
}

  render() {
    const { toggle, onSave, campaigns } = this.props;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      <Modal size="lg" isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Rule </ModalHeader>
        <ModalBody>
        <ol>
            <li>Rule Must contain only one if condition and one result campaign preceeded by then</li>
            <li>The Rule can contain multiple sentence separated by And/Or</li>
            <li>The Sentence must consists of a boolean isActive or property followed by an operator and a value EX: minNumberOfVisitsPerWeek = 5</li>
            <li>You can use brackets () to define the scope of the operator > 5</li>
            <li>EX: If not isActive and ( lastActiveDate >=  05/08/2019 or minNumberOfVisitsPerWeek = 5 ) then campaign 1 </li>
        </ol>
        <Navbar color="light" light expand="md">
            <Nav navbar>
                <UncontrolledDropdown className="ruleComponents">
                    <DropdownToggle caret>
                        User Properties
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.createPropertiesDropDown()}
                    </DropdownMenu>
                </UncontrolledDropdown>
                <Button onChange={this.onAddOpenBracket} className="ruleComponents">(</Button>
                <Button onChange={this.onAddClosingBracket} className="ruleComponents">)</Button>
                <UncontrolledDropdown className="ruleComponents">
                    <DropdownToggle caret>
                        Operators
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.createArithmeticOperatorsDropDown()}
                    </DropdownMenu>
                </UncontrolledDropdown>
                <DatePicker
                   onChange={this.onChange}
                    placeholderText="Add Date"
                    className="ruleComponents"
                />
                 <UncontrolledDropdown className="ruleComponents">
                    <DropdownToggle caret>
                        campaigns
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.createCampaignsDropDown()}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        </Navbar>
        <textarea 
                name="rule"
                onChange={this.handleChange}
                value={this.state.ruleParts}
                rows="10"
                className="fullWidthTextArea"
              />
        </ModalBody>
        {
            this.state.showRuleState && this.state.error && this.state.error !== "" &&
            <Label className="errorMsg">{this.state.error}</Label>
        }
        {
            this.state.showRuleState && (!this.state.error || this.state.error === "") &&
            <Label className="successMsg">Valid</Label>
        }
        <ModalFooter>
        <Button onClick={() => this.validateRule(this.state.ruleParts,true)}>
            Validate Rule
          </Button>
          <Button color="success" onClick={() => this.validateRule(this.state.ruleParts,true) && onSave(this.state.ruleActiveItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}