define([
    'views/list',
    'views/graph-manager/graph-base',
    'models/graph',
    'knockout'
], function(ListView, GraphBase, GraphModel , ko) {
    var BranchList = ListView.extend({
        /**
        * A backbone view to manage a list of graph nodes
        * @augments ListView
        * @constructor
        * @name NodeList
        */
        initialize: function(options) {
            ListView.prototype.initialize.apply(this, arguments);

            this.loading = options.loading || ko.observable(false);
            this.graphModel = options.graphModel;
            this.selectedNode = this.graphModel.get('selectedNode');
            this.items = options.branches;
            this.items().forEach(function (branch) {
                branch.graphModel = new GraphModel({
                    data: branch.graph
                })
            });
            this.selectedBranch = ko.observable(null);
            this.viewMetadata = ko.observable(false);

            this.selectedNode.subscribe(function(node){
                if(node){
                    _.each(this.items(), function(branch){
                        branch.filtered(true);
                        var found = _.find(branch.graph.domain_connections, function(domain_connection){
                            return _.find(domain_connection.ontology_classes, function(ontology_class){
                                return ontology_class.id === node.ontologyclass_id();
                            }, this) 
                        }, this);
                        if(found){
                            branch.filtered(false);
                        }
                    }, this);
                }
            }, this);
        },

        selectItem: function(item, evt){
            ListView.prototype.selectItem.apply(this, arguments);

            if(item.selected()){
                this.selectedBranch(item);
                this.graph = new GraphBase({
                    el: $('#branch-preview'),
                    graphModel: item.graphModel
                });
                this.viewMetadata(true);
            }else{
                this.selectedBranch(null);
                this.viewMetadata(false);
            }
        },

        appendBranch: function(item, evt){
            var self = this;
            if(this.selectedNode()){
                this.loading(true);
                var ontology_connection = _.find(item.graph.domain_connections, function(domain_connection){
                    return _.find(domain_connection.ontology_classes, function(ontology_class){
                        return ontology_class.id === this.selectedNode().ontologyclass_id();
                    }, this) 
                }, this);
                if(ontology_connection){
                    this.graphModel.appendBranch(this.selectedNode().nodeid, ontology_connection.ontology_property.id, item.graphid, function(response){
                        self.loading(false);
                    }, this)
                }else{
                    this.loading(true);
                    // need to alert the user!, although this shoudn't happen
                }
            }
            this.closeForm();
        },

        closeForm: function(){
            this.clearSelection();
            this.selectedBranch(null);
            this.viewMetadata(false);
        },



    });
    return BranchList;
});