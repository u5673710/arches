require([
    'jquery',
    'underscore',
    'knockout',
    'views/graph-page-view',
    'views/graph-manager/graph',
    'views/graph-manager/branch-list',
    'views/graph-manager/node-list',
    'views/graph-manager/permissions-list',
    'views/graph-manager/node-form',
    'views/graph-manager/permissions-form',
    'views/graph-manager/branch-info',
    'models/node',
    'models/graph',
    'graph-manager-data'
], function($, _, ko, PageView, GraphView, BranchListView, NodeListView, PermissionsListView, NodeFormView, PermissionsFormView, BranchInfoView, NodeModel, GraphModel, data) {
    var prepGraph = function(graph) {
        graph.nodes.forEach(function(node) {
            node.cardinality = 'n';
            if (node.nodeid === node.nodegroup_id) {
                var group = _.find(graph.nodegroups, function(nodegroup) {
                    return nodegroup.nodegroupid === node.nodeid;
                });
                node.cardinality = group.cardinality;
            }
        })
    };

    data.branches.forEach(function(branch){
        branch.selected = ko.observable(false);
        branch.filtered = ko.observable(false);
        prepGraph(branch.graph);
    }, this);

    prepGraph(data.graph);

    var graphModel = new GraphModel({
        data: data.graph,
        datatypes: data.datatypes
    });
    graphModel.get('nodes')()[0].selected(true);

    graphModel.on('changed', function(model, options){
        viewModel.graphView.redraw(true);
    });
    graphModel.on('select-node', function(model, options){
        viewModel.nodeForm.closeClicked(true);
    });

    var loading = ko.observable(false);
    var viewModel = {
        graphModel: graphModel,
        loading: loading
    };

    viewModel.graphView = new GraphView({
        el: $('#graph'),
        graphModel: graphModel
    });

    viewModel.branchListView= new BranchListView({
        el: $('#branch-library'),
        branches: ko.observableArray(data.branches),
        graphModel: graphModel,
        loading: loading
    });

    viewModel.nodeForm = new NodeFormView({
        el: $('#nodeCrud'),
        graphModel: graphModel,
        validations: data.validations,
        branchListView: viewModel.branchListView,
        loading: loading
    });

    viewModel.dirty = ko.computed(function () {
        var node = viewModel.nodeForm.node();
        return node ? viewModel.nodeForm.node().dirty() : false;
    });

    viewModel.nodeList = new NodeListView({
        el: $('#node-listing'),
        graphModel: graphModel
    });

    viewModel.permissionsList = new PermissionsListView({
        el: $('#node-permissions')
    });

    viewModel.permissionsForm = new PermissionsFormView({
        el: $('#permissions-panel')
    });

    new PageView({
        viewModel: viewModel
    });

    var resize = function(){
        $('#graph').height($(window).height()-100);
        $('.tab-content').height($(window).height()-191);
        $('.grid-container').height($(window).height()-260);
        viewModel.graphView.resize();
    }

    viewModel.nodeForm.node.subscribe(resize)

    $( window ).resize(resize);

    resize();
});