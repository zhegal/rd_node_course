export class BrewsController {
    static scope = 'scoped';

    constructor(brewsService) {
        console.log(`BrewsService initialized`);
        this.brewsService = brewsService;
    }

    index(req, res) {
        res.json(this.brewsService.getAll(req.validatedQuery));
    }

    show(req, res) {
        const { id } = req.params;
        res.json(this.brewsService.getOne(id));
    }

    create(req, res) {
        const { body } = req;
        res.status(201).json(this.brewsService.create(body));
    }

    update(req, res) {
        const { id } = req.params;
        const { body } = req;
        res.json(this.brewsService.update(id, body));
    }

    remove(req, res) {
        const { id } = req.params;
        this.brewsService.remove(id);
        res.status(204).end();
    }
}