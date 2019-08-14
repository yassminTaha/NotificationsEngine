import React, { Component } from "react";
import Modal from "./components/modal";
import RuleModal from './components/ruleModal';
import axios from "axios";

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          modal:false,
          ruleModal:false,
          viewCampaigns: true,
          viewUsers: false,
          viewRules: false,
          campaignList: [],
          userList : [],
          ruleList : []
        };
      }
      componentDidMount() {
        this.refreshList();
      }
      refreshList = () => {
        var currentState = this;
        axios
          .get("https://marketingcampaignengine.azurewebsites.net/api/campaigns/")
          .then(res => currentState.setState({ campaignList: res.data }))
          .catch(err => console.log(err));

        axios
          .get("https://marketingcampaignengine.azurewebsites.net/api/rules/")
          .then(res => this.setState({ ruleList: res.data }))
          .catch(err => console.log(err));

          axios
          .get("https://marketingcampaignengine.azurewebsites.net/api/users/")
          .then(res => this.setState({ userList: res.data }))
          .catch(err => console.log(err));
      };
      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };
      handleSubmit = item => {
        var currentState = this;
        this.toggle();
       
        if(item.startDate){
          var dd = item.startDate.getDate();
          var mm = item.startDate.getMonth() + 1; //January is 0!
          var yyyy = item.startDate.getFullYear();
          if (dd < 10) {
            dd = '0' + dd;
          } 
          if (mm < 10) {
            mm = '0' + mm;
          } 
          item.startDate = yyyy + '-' + mm + '-' + dd;
        }

        if(item.endDate){
          var dd = item.endDate.getDate();
          var mm = item.endDate.getMonth() + 1; //January is 0!
          var yyyy = item.endDate.getFullYear();
          if (dd < 10) {
            dd = '0' + dd;
          } 
          if (mm < 10) {
            mm = '0' + mm;
          } 
          item.endDate = yyyy + '-' + mm + '-' + dd;
        }
   
        if(item.id){
          axios.put("https://marketingcampaignengine.azurewebsites.net/api/campaigns/" + item.id+"/",item)
        .then(res => currentState.refreshList())
        .catch(err => console.log(err))
        }
        else{
        axios.post("https://marketingcampaignengine.azurewebsites.net/api/campaigns/",item)
        .then(res => currentState.refreshList())
        .catch(err => console.log(err))
        }
      };
      deleteCampaign = item => {
        var currentState = this;
        if(!item.id){
          this.refreshList();
        }
        else{
          axios.delete("https://marketingcampaignengine.azurewebsites.net/api/campaigns/" + item.id+"/",item)
          .then(res => currentState.refreshList())
          .catch(err => console.log(err))
        }
      };
      createCampaign = () => {
        const item = { name: "", pnTemplate: "", smsTemplate: "", numberOfPoints:1,costPerUser:0.00 };
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
      editCampaign = item => {
        if(item.startDate)
          item.startDate = new Date(item.startDate)
        if(item.endDate)
          item.endDate = new Date(item.endDate)
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
      displayCampaigns= status => {
        return this.setState({ viewCampaigns: true, viewUsers: false,viewRules: false  });
      };
      displayUsers= status => {
        return this.setState({ viewCampaigns: false, viewUsers: true,viewRules: false  });
      };

      toggleRuleModal = () => {
        this.setState({ ruleModal: !this.state.ruleModal });
      };
      handleSubmitRule = item => {
        var currentState = this;
        this.toggleRuleModal();
        if(item.id){
          axios.put("https://marketingcampaignengine.azurewebsites.net/api/rules/" + item.id+"/",item)
        .then(res => currentState.refreshList())
        .catch(err => console.log(err))
        }
        else{
        axios.post("https://marketingcampaignengine.azurewebsites.net/api/rules/",item)
        .then(res => currentState.refreshList())
        .catch(err => console.log(err))
        }
      };
      createRule = () => {
        const item = { description: "If ", campaign: 0 };
        this.setState({ ruleActiveItem: item, ruleModal: !this.state.ruleModal });
      };
      editRule = item => {
        console.log(item)
        this.setState({ ruleActiveItem: item, ruleModal: !this.state.modal });
      };
      deleteRule= item => {
        var currentState = this;
        if(!item.id){
          this.refreshList();
        }
        else{
          axios.delete("https://marketingcampaignengine.azurewebsites.net/api/rules/" + item.id+"/",item)
          .then(res => currentState.refreshList())
          .catch(err => console.log(err))
        }
      };
      displayRules= status => {
        return this.setState({ viewCampaigns: false, viewUsers: false,viewRules: true  });
      };
      renderTabList = () => {
        return (
          <div className="my-5 tab-list">
             <span
              onClick={() => this.displayUsers(false)}
              className={this.state.viewUsers ? "active" : ""}
            >
              Retained users
            </span>
            <span
              onClick={() => this.displayCampaigns(true)}
              className={this.state.viewCampaigns ? "active" : ""}
            >
              Campaigns
            </span>
            <span
              onClick={() => this.displayRules(false)}
              className={this.state.viewRules ? "active" : ""}
            >
              rules
            </span>
          </div>
        );
      };
      renderItems = () => {
        let newItems =[]
        if(this.state.viewCampaigns){
          newItems = this.state.campaignList;
          return newItems.map(item => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center">
              <span
                className={`campaign-title mr-2`}
                title={item.name}
              >
                {item.name}
              </span>
              <span
                className={`campaign-title mr-2`}
                title={item.numberOfPoints}
              >
                {item.numberOfPoints}
              </span>
              <span
                className={`campaign-title mr-2`}
                title={item.costPerUser}
              >
                {item.costPerUser}$
              </span>
              <span>
                <button  onClick={() => this.editCampaign(item)} className="btn btn-secondary mr-2"> Edit </button>
                <button onClick={() => this.deleteCampaign(item)} className="btn btn-danger">Delete </button>
              </span>
            </li>
          ));
        }
        if(this.state.viewUsers){
          newItems = this.state.userList.filter( function (user) {
            return user.retentionDate && new Date(user.retentionDate).getMonth() === (new Date()).getMonth();
          });
          return newItems.map(item => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center">
              <span
                className={`campaign-title mr-2`}
                title={item.fullName}
              >
                {item.fullName}
              </span>
              <span
                className={`campaign-title mr-2`}
                title={item.email}
              >
                {item.email}
              </span>
              <span
                className={`campaign-title mr-2`}
                title={item.retentionDate}
              >
                {item.retentionDate}
              </span>
              <span
                className={`campaign-title mr-2`}
                title={item.costOfRetention}
              >
                {item.costOfRetention}$
              </span>
            </li>
          ));
        }
        if(this.state.viewRules){
          newItems = this.state.ruleList;
          return newItems.map(item => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center">
              <span
                className={`campaign-title mr-2`}
                title={item.description}
              >
                {item.description}
              </span>
             
              <span>
                <button  onClick={() => this.editRule(item)} className="btn btn-secondary mr-2"> Edit </button>
                <button onClick={() => this.deleteRule(item)} className="btn btn-danger">Delete </button>
              </span>
            </li>
          ));
        }
       
       
      };
      render() {
        return (
          <main className="content">
            <h1 className="text-white text-uppercase text-center my-4">Campaigns app</h1>
            <div className="row ">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  {this.renderTabList()}
                  {
                    this.state.viewCampaigns  &&
                 
                    <li
                    className="btnDiv d-flex justify-content-between align-items-center">
                    <span
                      className={`campaign-header mr-2`}
                      title='Name'
                    >
                      Name
                    </span>
                    <span
                      className={`campaign-header mr-2`}
                      title='Number of points'
                    >
                      Number of points
                    </span>
                    <span
                      className={`campaign-header mr-2`}
                      title='Cost per user'
                    >
                      Cost per user
                    </span>
                    <span>
                    <button onClick={this.createCampaign} className="btn btn-primary mr-2">Add campaign</button>
                <span>  </span>
              </span>
                  </li>
                  }
                   {
                    this.state.viewRules  &&
                    <div className="btnDiv">
                      <button onClick={this.createRule} className="btn btn-primary">Add rule</button>
                    </div>
                  }
                  <ul className="list-group list-group-flush">
                    {this.renderItems()}
                  </ul>
                </div>
              </div>
            </div>
            {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                toggle={this.toggle}
                onSave={this.handleSubmit}
              />
            ) : null}
             {this.state.ruleModal ? (
              <RuleModal
                ruleActiveItem={this.state.ruleActiveItem}
                toggle={this.toggleRuleModal}
                onSave={this.handleSubmitRule}
                campaigns = {this.state.campaignList}
              />
            ) : null}
          </main>
        );
      }
    }
    export default App;