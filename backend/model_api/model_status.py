class ModelStatus:
    _instance = None

    def __init__(self):
        raise RuntimeError("This is a Singleton, invoke get_instance() instead.")
    
    @classmethod
    def get_instance(cls):
        if cls._instance == None:
            cls._instance = cls.__new__(cls)
            cls._instance.model_status = 'ready'
            cls._instance.time_estimate = 0
        return cls._instance
    

    def get_model_status(self):
        return self.model_status
    
    def get_time_estimate(self):
        return self.time_estimate
    
    def set_model_status(self, status):
        self.model_status = status

    def set_time_estimate(self, time):
        self.time_estimate = time
        