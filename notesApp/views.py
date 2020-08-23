from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import auth, messages
from django.contrib.auth.models import User
from .models import NotesUser
from django.contrib.auth.decorators import login_required

# Create your views here.

def notes(request):
	if request.user.is_authenticated:
		datas = NotesUser.objects.filter(user = request.user)
		if len(datas) > 0:
			return render(request, 'notes.html', {"name": request.user, "files": datas[0].files, "scrpt": "console.log('this is views.py');if(AllowNotification){new Notification('To do list')}"})
		else:
			return render(request, 'notes.html', {"name": request.user})
	return render(request, 'notes.html')



def register(request):
	if request.method == 'POST':
		username = request.POST['username']
		firstname = request.POST['firstname']
		lastname = request.POST['lastname']
		email = request.POST['email']
		password = request.POST['password']
		repassword = request.POST['repassword']

		if username==None or username=="" or firstname==None or firstname=="" or lastname==None or lastname=="" or email==None or email=="":
			messages.info(request, "fields can't be empty")
			return redirect('/')

		if password == repassword:

			try:
				user = User.objects.get(username=username)

				if user is not None:
					messages.info(request, 'user already exists')
					return redirect('/')

			except User.DoesNotExist:
				user = User.objects.create_user(username=username, password=password, email=email, first_name=firstname, last_name=lastname)
				notesuser = NotesUser(files=[], user=user)
				notesuser.save()
				auth.login(request, user)
				return redirect('/') # render(request, 'notes.html', {"name": firstname, "files": []})

		else:
			messages.info(request, "password not matching")
			return redirect('/')

	messages.info(request, "its a get method, unable to register")
	return redirect('/')


def login(request):
	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']

		user = auth.authenticate(username=username, password=password)

		if user is not None:
			auth.login(request, user)
			notesuser = NotesUser.objects.filter(user=user)
			if len(notesuser) == 1:
				return  redirect('/') # render(request, 'notes.html', {"name": user.first_name, "files": notesuser[0].files})
			else:
				messages.info(request, "no notes, please create normal account, your a superuser")
				return redirect('/')
		else:
			messages.info(request, "user does not exists, please register or may be password wrong")
			return redirect('/')

	else:
		messages.info(request, "its a get method, unable to login")
		return redirect('/')
	return HttpResponse(request, "Some error Occured while logging you in.")


@login_required(login_url='/login/')
def signout(request):
	auth.logout(request)
	return redirect('/')


@login_required(login_url='/login/')
def addFile(request):
	if request.method == "POST":
		user = User.objects.filter(username=request.user)
		if len(user) != 0:
			datas = NotesUser.objects.get(user = user[0])
			filename = request.POST["filename"]
			filedata = request.POST["filedata"]

			if filename=="" or filedata=="":
				messages.info(request, "please enter both file name and data.")
				return redirect('/')

			filesList = datas.files[:]
			
			for data in filesList:
				if data["name"] == filename:
					messages.info(request, "file already exists and file is altered")
					data["text"] = filedata;
					datas.files = filesList[:]
					datas.save()
					return redirect('/')


			filesList.append({'name': filename, 'text': filedata})
			datas.files = filesList[:]
			datas.save()

			messages.info(request, "saved successfully")

			return redirect('/')
		else:
			messages.info(request, "maybe user logged out, sorry file not saved")
			return redirect('/')
	else:
		messages.info("it's a get request can't add file.")
		return redirect('/')
	# get data from file name and file data and add it to backend to that user



@login_required(login_url='/login/')
def deleteFile(request):
	if request.method == "POST":
		user = User.objects.filter(username=request.user)
		if len(user) != 0:
			datas = NotesUser.objects.get(user = user[0])
			filename = request.POST["name"]
			filesList = datas.files[:]
			i = 0
			for data in filesList:
				if data["name"] == filename:
					try:
						filesList.remove(data)
						datas.files = filesList[:]
					except ValueError:
						messages.info(request, "some error occured")
					finally:
						messages.info(request, "deleted successfully")
						datas.save()
					break
				i += 1
			else:
				messages.info(request, "unable to delete file.")

		else:
			messages.info(request, "sorry can't delete file")
	else:
		messages.info(request, "the method is not POST")

	# print("after delete file :", datas.files)
	return redirect('/')
