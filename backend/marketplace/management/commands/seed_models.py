from django.core.management.base import BaseCommand
from marketplace.models import ModelProvider, AIModel, ModelUsageStats
from decimal import Decimal


class Command(BaseCommand):
    help = 'Seed the database with sample AI models and providers'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))
        
        # Create providers
        providers_data = [
            {
                'name': 'switchpoint',
                'display_name': 'Switchpoint',
                'description': 'Switchpoint Router - Intelligent model routing',
                'website': 'https://openrouter.ai',
                'logo_url': 'https://openrouter.ai/favicon.ico'
            },
            {
                'name': 'openai',
                'display_name': 'OpenAI',
                'description': 'Leading AI research company',
                'website': 'https://openai.com',
                'logo_url': 'https://openai.com/favicon.ico'
            },
            {
                'name': 'anthropic',
                'display_name': 'Anthropic',
                'description': 'AI safety focused company',
                'website': 'https://anthropic.com',
                'logo_url': 'https://anthropic.com/favicon.ico'
            },
            {
                'name': 'google',
                'display_name': 'Google',
                'description': 'Google AI models',
                'website': 'https://ai.google',
                'logo_url': 'https://ai.google/favicon.ico'
            }
        ]
        
        providers = {}
        for provider_data in providers_data:
            provider, created = ModelProvider.objects.get_or_create(
                name=provider_data['name'],
                defaults=provider_data
            )
            providers[provider_data['name']] = provider
            if created:
                self.stdout.write(f'Created provider: {provider.display_name}')
        
        # Create models
        models_data = [
            {
                'model_id': 'switchpoint/openrouter-4b',
                'name': 'Switchpoint Router',
                'display_name': 'Switchpoint Router',
                'provider': 'switchpoint',
                'description': 'Intelligent routing to the best model for your request',
                'category': 'chat',
                'context_length': 128000,
                'max_output_tokens': 4096,
                'prompt_cost': Decimal('0.5'),
                'completion_cost': Decimal('1.5'),
                'quality_score': Decimal('9.2'),
                'speed_score': Decimal('8.5'),
                'popularity_score': Decimal('9.0'),
                'supports_functions': True,
                'supports_vision': True,
                'supports_streaming': True,
                'is_featured': True
            },
            {
                'model_id': 'openai/gpt-3.5-turbo',
                'name': 'GPT-3.5 Turbo',
                'display_name': 'GPT-3.5 Turbo',
                'provider': 'openai',
                'description': 'Fast and efficient model for most use cases',
                'category': 'chat',
                'context_length': 16384,
                'max_output_tokens': 4096,
                'prompt_cost': Decimal('0.5'),
                'completion_cost': Decimal('1.5'),
                'quality_score': Decimal('8.0'),
                'speed_score': Decimal('9.5'),
                'popularity_score': Decimal('9.5'),
                'supports_functions': True,
                'supports_vision': False,
                'supports_streaming': True,
                'is_featured': True
            },
            {
                'model_id': 'openai/gpt-4',
                'name': 'GPT-4',
                'display_name': 'GPT-4',
                'provider': 'openai',
                'description': 'Most capable OpenAI model for complex tasks',
                'category': 'chat',
                'context_length': 8192,
                'max_output_tokens': 4096,
                'prompt_cost': Decimal('30.0'),
                'completion_cost': Decimal('60.0'),
                'quality_score': Decimal('9.8'),
                'speed_score': Decimal('7.0'),
                'popularity_score': Decimal('9.0'),
                'supports_functions': True,
                'supports_vision': False,
                'supports_streaming': True,
                'is_featured': True
            },
            {
                'model_id': 'anthropic/claude-3-haiku',
                'name': 'Claude 3 Haiku',
                'display_name': 'Claude 3 Haiku',
                'provider': 'anthropic',
                'description': 'Fast and affordable Claude model',
                'category': 'chat',
                'context_length': 200000,
                'max_output_tokens': 4096,
                'prompt_cost': Decimal('0.25'),
                'completion_cost': Decimal('1.25'),
                'quality_score': Decimal('8.5'),
                'speed_score': Decimal('9.0'),
                'popularity_score': Decimal('8.0'),
                'supports_functions': True,
                'supports_vision': True,
                'supports_streaming': True,
                'is_featured': True
            },
            {
                'model_id': 'anthropic/claude-3-sonnet',
                'name': 'Claude 3 Sonnet',
                'display_name': 'Claude 3 Sonnet',
                'provider': 'anthropic',
                'description': 'Balanced Claude model for complex reasoning',
                'category': 'chat',
                'context_length': 200000,
                'max_output_tokens': 4096,
                'prompt_cost': Decimal('3.0'),
                'completion_cost': Decimal('15.0'),
                'quality_score': Decimal('9.5'),
                'speed_score': Decimal('8.0'),
                'popularity_score': Decimal('8.5'),
                'supports_functions': True,
                'supports_vision': True,
                'supports_streaming': True,
                'is_featured': True
            },
            {
                'model_id': 'google/gemini-pro',
                'name': 'Gemini Pro',
                'display_name': 'Gemini Pro',
                'provider': 'google',
                'description': 'Google\'s most capable multimodal model',
                'category': 'chat',
                'context_length': 32768,
                'max_output_tokens': 8192,
                'prompt_cost': Decimal('0.5'),
                'completion_cost': Decimal('1.5'),
                'quality_score': Decimal('8.8'),
                'speed_score': Decimal('8.5'),
                'popularity_score': Decimal('7.5'),
                'supports_functions': True,
                'supports_vision': True,
                'supports_streaming': True,
                'is_featured': True
            }
        ]
        
        for model_data in models_data:
            provider_name = model_data.pop('provider')
            model_data['provider'] = providers[provider_name]
            
            model, created = AIModel.objects.get_or_create(
                model_id=model_data['model_id'],
                defaults=model_data
            )
            
            if created:
                self.stdout.write(f'Created model: {model.display_name}')
                
                # Create usage stats for the model
                ModelUsageStats.objects.get_or_create(
                    model=model,
                    defaults={
                        'total_requests': 0,
                        'total_tokens': 0,
                        'total_cost': Decimal('0'),
                        'avg_response_time': Decimal('0'),
                        'success_rate': Decimal('100.00')
                    }
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded database with {len(providers_data)} providers and {len(models_data)} models'
            )
        )