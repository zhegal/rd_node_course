export class BrewsController {
    static scope = 'scoped';
    
    constructor(brewsService) {
        console.log(`BrewsService initialized`);
        this.service = brewsService;
    }

    index(req, res) {
        res.json({ hello: 'world' });
    }
    show(req, res) {
        res.send('Get one brew');
    }
    create(req, res) {
        res.send('Create brew');
    }
    update(req, res) {
        res.send('Update brew');
    }
    remove(req, res) {
        res.send('Remove brew');
    }
}